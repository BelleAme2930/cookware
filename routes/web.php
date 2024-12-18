<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerLedgerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SalesInvoiceController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SupplierLedgerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/sales/type/{saleType}', [SaleController::class, 'showSalesByType'])->name('sales.byType');
    Route::get('/purchases/type/{purchaseType}', [PurchaseController::class, 'showPurchasesByType'])->name('purchases.byType');

    Route::get('/suppliers/ledgers', [SupplierLedgerController::class, 'index'])->name('suppliers.ledgers.index');
    Route::get('/suppliers/{supplier}/ledger', [SupplierLedgerController::class, 'show'])->name('suppliers.ledgers.show');
    Route::get('/customers/ledgers', [CustomerLedgerController::class, 'index'])->name('customers.ledgers.index');
    Route::get('/customers/{customer}/ledger', [CustomerLedgerController::class, 'show'])->name('customers.ledgers.show');

    Route::resource('categories', CategoryController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('products', ProductController::class);
    Route::resource('customers', CustomerController::class);
    Route::get('/sales/invoices', [SalesInvoiceController::class, 'index'])->name('sales.invoices.index');
    Route::get('/sales/{sale}/invoice', [SalesInvoiceController::class, 'show'])->name('sales.invoices.show');
    Route::resource('sales', SaleController::class);
    Route::resource('accounts', AccountController::class);
    Route::get('/purchases/invoices', [PurchaseInvoiceController::class, 'index'])->name('purchases.invoices.index');
    Route::get('/purchases/{purchase}/invoice', [PurchaseInvoiceController::class, 'show'])->name('purchases.invoices.show');
    Route::resource('purchases', PurchaseController::class);
    Route::resource('expenses', ExpenseController::class);


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
