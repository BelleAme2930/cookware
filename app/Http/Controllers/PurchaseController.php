<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethodEnum;
use App\Enums\ProductTypeEnum;
use App\Helpers\WeightHelper;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\PurchaseResource;
use App\Http\Resources\SupplierResource;
use App\Models\Account;
use App\Models\Product;
use App\Models\ProductPurchase;
use App\Models\ProductSize;
use App\Models\Purchase;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['productPurchases', 'supplier'])->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => PurchaseResource::collection($purchases)->resolve(),
        ]);
    }

    public function create()
    {
        $accounts = Account::all();
        $suppliers = Supplier::all();
        $products = Product::with('sizes')->get();

        return Inertia::render('Purchases/Create', [
            'products' => ProductResource::collection($products)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'productPurchases.product', 'productPurchases.productSize', 'account']);

        return Inertia::render('Purchases/Show', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'payment_method' => 'required|string',
            'due_date' => 'nullable|date',
            'account_id' => 'nullable|exists:accounts,id',
            'total_price' => 'required|int|min:0',
            'amount_paid' => 'nullable|numeric|min:0',
            'cheque_number' => 'nullable|string',
            'products' => 'required|array|min:1',
            'products.*.weight' => 'nullable|int|min:0',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_type' => 'required|string',
            'products.*.sizes' => 'required|array|min:1',
            'products.*.sizes.*.id' => 'required|exists:product_sizes,id',
            'products.*.sizes.*.size' => 'required|string',
            'products.*.sizes.*.quantity' => 'required|integer|min:1',
            'products.*.sizes.*.purchase_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $purchase = Purchase::create([
                'supplier_id' => $validatedData['supplier_id'],
                'account_id' => null,
                'total_price' => $validatedData['total_price'],
                'amount_paid' => 0,
                'remaining_balance' => 0,
                'due_date' => null,
                'weight' => 0,
                'quantity' => 0,
                'cheque_number' => null,
                'purchase_date' => Carbon::today(),
                'payment_method' => $validatedData['payment_method'],
            ]);

            if (in_array($validatedData['payment_method'], [
                PaymentMethodEnum::CREDIT->value,
                PaymentMethodEnum::CASH_CREDIT->value,
                PaymentMethodEnum::ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_CHEQUE->value,
                PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'due_date' => $validatedData['due_date'],
                ]);
            }

            if (in_array($validatedData['payment_method'] , [
                PaymentMethodEnum::CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE->value,
                PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'cheque_number' => $validatedData['cheque_number'],
                ]);
            }

            if (in_array($validatedData['payment_method'], [
                PaymentMethodEnum::ACCOUNT->value,
                PaymentMethodEnum::CASH_ACCOUNT->value,
                PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                PaymentMethodEnum::ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'account_id' => $validatedData['account_id'],
                ]);
            }

            if (in_array($validatedData['payment_method'], [
                PaymentMethodEnum::CASH->value,
                PaymentMethodEnum::ACCOUNT->value,
                PaymentMethodEnum::CASH_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'amount_paid' => $validatedData['total_price'],
                    'remaining_balance' => 0,
                ]);
            }

            if (in_array($validatedData['payment_method'], [
                PaymentMethodEnum::CREDIT->value,
                PaymentMethodEnum::CHEQUE->value,
            ])) {
                $purchase->update([
                    'amount_paid' => 0,
                    'remaining_balance' => $validatedData['total_price'],
                ]);
            }

            if (in_array($validatedData['payment_method'], [
                PaymentMethodEnum::CASH_CREDIT->value,
                PaymentMethodEnum::ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_ACCOUNT_CREDIT->value,
                PaymentMethodEnum::CASH_CHEQUE->value,
                PaymentMethodEnum::ACCOUNT_CHEQUE->value,
                PaymentMethodEnum::CASH_CHEQUE_ACCOUNT->value,
            ])) {
                $purchase->update([
                    'amount_paid' => $validatedData['amount_paid'],
                    'remaining_balance' => $validatedData['total_price'] - $validatedData['amount_paid'],
                ]);
            }

            $weight = 0;
            $quantity = 0;

            foreach ($validatedData['products'] as $productData) {
                $product = Product::find($productData['product_id']);

                if ($product->product_type === ProductTypeEnum::WEIGHT->value) {
                    $weight += $productData['weight'];
                }

                foreach ($productData['sizes'] as $sizeData) {
                    $size = ProductSize::find($sizeData['id']);

                    $quantity += $sizeData['quantity'];

                    if ($product->product_type === ProductTypeEnum::ITEM->value) {
                        $purchase->productPurchases()->create([
                            'product_id' => $product->id,
                            'product_size_id' => $size->id,
                            'quantity' => $sizeData['quantity'],
                            'purchase_price' => $sizeData['purchase_price'],
                        ]);
                    } else {
                        $purchase->productPurchases()->create([
                            'product_id' => $product->id,
                            'product_size_id' => $size->id,
                            'quantity' => $sizeData['quantity'],
                            'purchase_price' => $sizeData['purchase_price'],
                            'weight' => WeightHelper::toGrams($productData['weight']),
                        ]);
                    }
                }
            }

            $purchase->update([
                'weight' => WeightHelper::toGrams($weight),
                'quantity' => $quantity,
            ]);

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {

            DB::rollback();

            return back()->withErrors(['error' => 'Failed to create purchase: ' . $e->getMessage()]);
        }
    }


    public function edit(Purchase $purchase)
    {
        $products = Product::all();
        $suppliers = Supplier::all();
        $accounts = Account::all();
        $purchase->load(['products', 'supplier']);

        return Inertia::render('Purchases/Edit', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
            'accounts' => AccountResource::collection($accounts)->resolve(),
        ]);
    }

    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {

            foreach ($purchase->products as $oldProduct) {
                $product = Product::find($oldProduct->id);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $oldQuantity = $oldProduct->pivot->quantity;
                $oldWeight = $oldProduct->pivot->weight;

                $product->decrement('quantity', $oldQuantity);
                $product->decrement('weight', $oldWeight);
            }

            $purchase->products()->detach();

            $purchase->update([
                'supplier_id' => $validated['supplier_id'],
                'payment_method' => $validated['payment_method'],
                'account_id' => $validated['payment_method'] === PaymentMethodEnum::ACCOUNT->value ? $validated['account_id'] : null,
                'purchase_date' => $validated['purchase_date'] ?? $purchase->purchase_date,  // Optionally update purchase date
            ]);

            if ($validated['payment_method'] === PaymentMethodEnum::CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value ||
                $validated['payment_method'] === PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value) {
                $purchase->update([
                    'due_date' => $validated['due_date'],
                ]);
            } else {
                $purchase->update(['due_date' => null]);
            }

            $totalPrice = 0;

            foreach ($validated['products'] as $productData) {
                $product = Product::find($productData['product_id']);
                $productType = $product->product_type;
                $weightPerItem = WeightHelper::toKilos($product->weight_per_item);

                $quantity = 0;
                $weight = 0;

                if ($productType === ProductTypeEnum::WEIGHT->value) {
                    $quantity = $productData['weight'] / $weightPerItem;
                    $weight = $productData['weight'];
                    $totalPrice += ($productData['purchase_price'] * $weight);
                } else {
                    $quantity = $productData['quantity'];
                    $weight = $productData['quantity'] * $weightPerItem;
                    $totalPrice += ($productData['purchase_price'] * $quantity);
                }

                $purchase->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'weight' => WeightHelper::toGrams($weight),
                    'purchase_price' => $productData['purchase_price'],
                ]);

                $product->increment('quantity', $quantity);
                $product->increment('weight', WeightHelper::toGrams($weight));
            }

            $purchase->update([
                'total_price' => $totalPrice,
            ]);

            switch ($validated['payment_method']) {
                case PaymentMethodEnum::ACCOUNT->value:
                case PaymentMethodEnum::CASH->value:
                case PaymentMethodEnum::HALF_CASH_HALF_ACCOUNT->value:
                    $purchase->update([
                        'amount_paid' => 0,
                        'remaining_balance' => 0,
                    ]);
                    break;
                case PaymentMethodEnum::CREDIT->value:
                    $purchase->update([
                        'amount_paid' => $totalPrice,
                        'remaining_balance' => $totalPrice,
                    ]);
                    break;
                case PaymentMethodEnum::HALF_ACCOUNT_HALF_CREDIT->value:
                case PaymentMethodEnum::HALF_CASH_HALF_CREDIT->value:
                    $purchase->update([
                        'amount_paid' => $validated['amount_paid'] ?: 0,
                        'remaining_balance' => $validated['amount_paid'] ? ($totalPrice - $validated['amount_paid']) : 0,
                    ]);
                    break;
            }

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            info('Error while updating purchase: ' . $e->getMessage());

            return redirect()->route('purchases.index')->with('error', 'Failed to update purchase. Please try again.');
        }
    }

    public function destroy(Purchase $purchase)
    {
        try {
            DB::beginTransaction();

            foreach ($purchase->productPurchases as $productPurchase) {
                $product = $productPurchase->product;

                // Check if the product exists before incrementing
                if ($product) {
                    if ($productPurchase->quantity) {
                        $product->increment('quantity', $productPurchase->quantity);
                    }
                    if ($productPurchase->weight) {
                        $product->increment('weight', $productPurchase->weight);
                    }
                }
            }

            $purchase->delete();

            DB::commit();

            return redirect()->route('purchases.index')->with('success', 'Purchase deleted successfully.');
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors(['error' => 'Failed to delete purchase: ' . $e->getMessage()]);
        }
    }


    private function calculatePurchasePrice($productData, $productType)
    {
        if ($productType === ProductTypeEnum::ITEM->value) {
            return ($productData['price'] * $productData['quantity']);
        } elseif ($productType === ProductTypeEnum::WEIGHT->value) {
            return ($productData['price'] * $productData['weight']);
        }

        return 0;
    }
}
