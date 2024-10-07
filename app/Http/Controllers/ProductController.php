<?php

namespace App\Http\Controllers;

use App\Enums\ProductTypeEnum;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SupplierResource;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\WeightHelper;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'supplier'])->get();
        return Inertia::render('Products/Index', [
            'products' => ProductResource::collection($products)->resolve(),
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $suppliers = Supplier::all();
        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'sale_price' => 'required|numeric|min:1',
            'product_type' => 'required|string',
            'weight_per_item' => 'required|integer',
        ]);

        Product::create([
            'category_id' => $request->category_id,
            'supplier_id' => $request->supplier_id,
            'name' => $request->name,
            'sale_price' => $request->sale_price,
            'weight' => 0,
            'quantity' => 0,
            'weight_per_item' => $request->weight_per_item,
            'product_type' => $request->product_type,
        ]);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }


    public function show(Product $product)
    {
        $product->weight_per_unit_kilos = WeightHelper::toKilos($product->weight_per_unit);
        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        $suppliers = Supplier::all();

        $product->load(['category', 'supplier']);

        return Inertia::render('Products/Edit', [
            'product' => ProductResource::make($product)->resolve(),
            'categories' => CategoryResource::collection($categories)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'sale_price' => 'required|numeric|min:1',
            'product_type' => 'required|string',
        ]);

        $product->update([
            'category_id' => $request->category_id,
            'supplier_id' => $request->supplier_id,
            'name' => $request->name,
            'sale_price' => $request->sale_price,
            'product_type' => $request->product_type,
        ]);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }




    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
