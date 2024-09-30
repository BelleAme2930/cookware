<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['products'])->get();
        return Inertia::render('Categories/Index', [
            'categories' => CategoryResource::collection($categories),
        ]);

    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('categories.index');
    }

    public function show(Category $category)
    {
        $category->load('products');
        return Inertia::render('Categories/Show', [
            'category' => CategoryResource::make($category)->resolve(),
        ]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => CategoryResource::make($category)->resolve(),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update($validatedData);

        return redirect()->route('categories.index');
    }



    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index');
    }
}
