<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
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
            'purchases' => $purchases
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
        $purchase->load(['supplier', 'products']);

        return Inertia::render('Purchases/Invoices/Show', [
            'purchase' => PurchaseResource::make($purchase)->resolve(),
        ]);
    }
}
