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
        $products = Product::with(['sizes'])->get();

        return Inertia::render('Products/Index', [
            'products' => ProductResource::collection($products)->resolve(),
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $suppliers = Supplier::all();
        return Inertia::render('Products/Create', [
            'categories' => CategoryResource::collection($categories)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'product_type' => 'required|string',
            'sizes' => 'nullable|array',
            'sizes.*.size' => 'nullable|string',
            'sizes.*.weight' => 'nullable|numeric',
            'sizes.*.sale_price' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'category_id' => $request->category_id,
            'supplier_id' => $request->supplier_id,
            'name' => $request->name,
            'weight' => 0,
            'quantity' => 0,
            'product_type' => $request->product_type,
        ]);

        foreach ($request->sizes ?? [] as $size) {
            $product->sizes()->create([
                'size' => $size['size'] ?? null,
                'sale_price' => $size['sale_price'],
                'weight' => $request->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($size['weight']) : null,
            ]);
        }


        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $product->load(['category', 'supplier', 'sizes']);

        return Inertia::render('Products/Show', [
            'product' => ProductResource::make($product)->resolve(),
        ]);
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        $suppliers = Supplier::all();

        $product->load(['category', 'supplier', 'sizes']);

        return Inertia::render('Products/Edit', [
            'product' => ProductResource::make($product)->resolve(),
            'categories' => CategoryResource::collection($categories)->resolve(),
            'suppliers' => SupplierResource::collection($suppliers)->resolve(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'product_type' => 'required|string',
            'sizes' => 'required|array',
            'sizes.*.size' => 'required|string',
            'sizes.*.weight' => 'nullable|numeric',
            'sizes.*.sale_price' => 'required|integer|min:0',
        ]);

        $product->update([
            'category_id' => $request->category_id,
            'supplier_id' => $request->supplier_id,
            'name' => $request->name,
            'product_type' => $request->product_type,
        ]);

        $product->sizes()->delete();

        foreach ($request->sizes as $size) {
            $product->sizes()->create([
                'size' => $size['size'],
                'sale_price' => $size['sale_price'],
                'weight' => $request->product_type === ProductTypeEnum::WEIGHT->value ? WeightHelper::toGrams($size['weight']) : null,
            ]);
        }

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }



    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
