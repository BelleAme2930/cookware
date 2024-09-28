<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SupplierResource;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Helpers\WeightHelper;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'supplier'])->get();
        return Inertia::render('Products/Index', [
            'products' => ProductResource::collection($products),
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
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'weight' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $directoryPath = 'assets/images/uploads/products';

            if (!file_exists($directoryPath)) {
                mkdir($directoryPath, 0755, true);
            }

            $randomString = Str::random(10);
            $extension = $request->file('image')->getClientOriginalExtension();
            $imageName = $randomString . '.' . $extension;

            $request->file('image')->move($directoryPath, $imageName);

            $imagePath = 'assets/images/uploads/products/' . $imageName;
        }

        Product::create([
            'category_id' => $request->category_id,
            'supplier_id' => $request->supplier_id,
            'name' => $request->name,
            'weight' => WeightHelper::toGrams($request->weight),
            'image' => $imagePath,
        ]);

        return redirect()->route('products.index');
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
            'name' => 'required|string|max:255',
            'weight' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        $product->update([
            'category_id' => $request->category_id,
            'supplier_id' => $request->supplier_id,
            'name' => $request->name,
            'weight' => WeightHelper::toGrams($request->weight),
            'image' => $imagePath,
        ]);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index');
    }
}
