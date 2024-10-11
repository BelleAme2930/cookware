<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SaleResource;
use App\Models\Account;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'products'])->get();

        return Inertia::render('Sales/Index', [
            'sales' => SaleResource::collection($sales)->resolve(),
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::all();

        return Inertia::render('Sales/Create', [
            'customers' => CustomerResource::collection($customers)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function store(StoreSaleRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Create the sale record
            $sale = Sale::create([
                'customer_id' => $validated['customer_id'],
                'payment_method' => $validated['payment_method'],
                'total_price' => 0,
                'sale_date' => Carbon::today(),
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            // Handle due date for specific payment methods
            if ($validated['payment_method'] === PaymentMethodEnum::CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value) {
                $sale->update([
                    'due_date' => $validated['due_date'],
                ]);
            }

            $totalPrice = 0;

            // Iterate over the products in the sale
            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $quantity = 0;
                $weight = 0;

                if ($productType === ProductTypeEnum::WEIGHT->value) {
                    $quantity = $productData['weight'] / $weightPerItem;
                    $weight = $productData['weight'];
                    $totalPrice += ($productData['sale_price'] * $weight);
                } else {
                    $quantity = $productData['quantity'];
                    $weight = $productData['quantity'] * $weightPerItem;
                    $totalPrice += ($productData['sale_price'] * $quantity);
                }

                // Attach the product to the sale with necessary details
                $sale->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => WeightHelper::toGrams($weight),
                    'sale_price' => $productData['sale_price'],
                ]);

                // Update product quantities in stock
                $product->decrement('quantity', $quantity); // Assuming sales decrease inventory
                $product->decrement('weight', WeightHelper::toGrams($weight));
            }

            // Update the total price of the sale
            $sale->update([
                'total_price' => $totalPrice,
            ]);

            // Update payment details based on the payment method
            switch ($validated['payment_method']) {
                case PaymentMethodEnum::ACCOUNT->value:
                case PaymentMethodEnum::CASH->value:
                case PaymentMethodEnum::HALF_CASH_HALF_ACCOUNT->value:
                    $sale->update([
                        'amount_received' => 0,
                        'remaining_balance' => 0,
                    ]);
                    break;
                case PaymentMethodEnum::CREDIT->value:
                    $sale->update([
                        'amount_received' => $totalPrice,
                        'remaining_balance' => $totalPrice,
                    ]);
                    break;
                case PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value:
                case PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value:
                    $sale->update([
                        'amount_received' => $validated['amount_received'] ?: 0,
                        'remaining_balance' => $validated['amount_received'] ? ($totalPrice - $validated['amount_received']) : 0,
                    ]);
                    break;
            }

            DB::commit();

            return redirect()->route('sales.index')->with('success', 'Sale added successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            info('Error while adding sale: ' . $e->getMessage());

            return redirect()->route('sales.index')->with('error', 'Failed to add sale. Please try again.');
        }
    }


    public function edit(Sale $sale)
    {
        $sale->load(['customer', 'products']);
        $customers = Customer::all();
        $accounts = Account::all();
        $products = Product::all();

        return Inertia::render('Sales/Edit', [
            'sale' => SaleResource::make($sale)->resolve(),
            'customers' => CustomerResource::collection($customers)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.quantity' => 'nullable|integer|min:0',
            'products.*.weight' => 'nullable|numeric|min:0',
            'products.*.sale_price' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_method' => 'required|string',
            'account_id' => 'nullable|exists:accounts,id',
            'semi_credit_amount' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($sale, $validated) {
            $sale->update([
                'customer_id' => $validated['customer_id'],
                'due_date' => $validated['due_date'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
            ]);

            $totalPrice = 0;

            // Clear previous product relationships
            $sale->products()->detach();

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);

                $quantity = $product->product_type === ProductTypeEnum::ITEM->value ? $productData['quantity'] : null;
                $weight = $product->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($productData['weight']) : null;

                $sale->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => $weight,
                    'sale_price' => $productData['sale_price'],
                ]);

                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $totalPrice += ($productData['sale_price'] * $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $totalPrice += ($productData['sale_price'] * $productData['weight']);
                }

                // Update product quantities/weights accordingly
                if ($product->product_type === ProductTypeEnum::ITEM->value && $quantity) {
                    $product->decrement('quantity', $quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value && $weight) {
                    $product->decrement('weight', $weight);
                }
            }

            // Update total price in the sale
            $sale->update(['total_price' => $totalPrice]);

            // Handle semi credit and credit payment methods
            if ($validated['payment_method'] === PaymentMethodEnum::SEMI_CREDIT->value) {
                $semiCreditAmount = $validated['semi_credit_amount'] ?? 0;
                $remainingBalance = $totalPrice - $semiCreditAmount;

                $sale->update([
                    'semi_credit_amount' => $semiCreditAmount,
                    'remaining_balance' => $remainingBalance,
                ]);
            } elseif ($validated['payment_method'] === PaymentMethodEnum::CREDIT->value) {
                // For CREDIT payment method, set semi_credit_amount to totalPrice and remaining_balance to totalPrice
                $sale->update([
                    'semi_credit_amount' => $totalPrice,
                    'remaining_balance' => $totalPrice,
                ]);
            }
        });

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully');
    }

    public function show(Sale $sale)
    {
        $sale->load(['customer', 'products']);

        return Inertia::render('Sales/Show', [
            'sale' => SaleResource::make($sale)->resolve(),
        ]);
    }

    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            foreach ($sale->products as $product) {
                $sale->products()->detach($product->id);
                if ($product->product_type === ProductTypeEnum::ITEM->value) {
                    $product->increment('quantity', $product->pivot->quantity);
                } elseif ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $product->increment('weight', $product->pivot->weight);
                }
            }

            $sale->delete();
        });

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }
}
