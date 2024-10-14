<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::all();
        return Inertia::render('Accounts/Index', [
            'accounts' => AccountResource::collection($accounts),
        ]);
    }

    public function create()
    {
        return Inertia::render('Accounts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'bank_name' => 'required|string|max:255',
            'account_type' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        Account::create($validated);

        return redirect()->route('accounts.index')->with('success', 'Account created successfully.');
    }

    public function edit(Account $account)
    {
        return Inertia::render('Accounts/Edit', [
            'account' => AccountResource::make($account)->resolve(),
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'bank_name' => 'required|string|max:255',
            'account_type' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        $account->update($validated);

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully.');
    }

    public function destroy(Account $account)
    {
        $account->delete();

        return redirect()->route('accounts.index')->with('success', 'Account deleted successfully.');
    }
}
