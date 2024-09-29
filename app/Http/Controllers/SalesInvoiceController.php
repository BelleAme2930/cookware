<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SalesInvoiceController extends Controller
{
    /**
     * Display a listing of the sales-based invoices.
     *
     * @return Response
     */
    public function index()
    {
        $sales = Sale::with('customer')->paginate(10);

        return Inertia::render('Sales/Invoices/Index', [
            'sales' => $sales
        ]);
    }

    /**
     * Show the specified sales-based invoice.
     *
     * @param Sale $sale
     * @return Response
     */
    public function show(Sale $sale)
    {
        $sale->load('customer', 'products');

        return Inertia::render('Sales/Invoices/Show', [
            'sale' => $sale
        ]);
    }

    /**
     * Remove the specified sales-based invoice from storage.
     *
     * @param Sale $sale
     * @return RedirectResponse
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();

        return redirect()->route('sales.invoices.index')->with('success', 'Sale invoice deleted successfully.');
    }
}
