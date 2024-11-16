<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Resources\PurchaseResource;
use App\Models\Product;
use App\Models\Purchase;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseInvoiceController extends Controller
{
    /**
     * Display a listing of the purchase-based invoices.
     *
     * @return Response
     */
    public function index()
    {
        $purchases = Purchase::with('supplier')->get();

        return Inertia::render('Purchases/Invoices/Index', [
            'purchases' => PurchaseResource::collection($purchases)->resolve(),
        ]);
    }

    /**
     * Show the specified purchase-based invoice.
     *
     * @param Purchase $purchase
     * @return Response
     */
    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier.purchases', 'productPurchases', 'account']);

        $products = Product::with(['sizes'])->get();

        return Inertia::render('Purchases/Invoices/Show', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
            'products' => ProductResource::collection($products)->resolve(),
        ]);
    }
}
