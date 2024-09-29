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
        $request->validate([
            'title' => 'required|string|max:255|unique:accounts,title',
            'account_number' => 'required|string|max:255|unique:accounts,account_number',
            'bank_name' => 'required|string|max:255',
            'account_type' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        Account::create($request->all());

        return redirect()->route('accounts.index');
    }

    public function edit(Account $account)
    {
        return Inertia::render('Accounts/Edit', [
            'account' => $account,
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:accounts,title,' . $account->id,
            'account_number' => 'required|string|max:255|unique:accounts,account_number,' . $account->id,
            'bank_name' => 'required|string|max:255',
            'account_type' => 'nullable|string|max:255',
            'balance' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        $account->update($request->all());

        return redirect()->route('accounts.index');
    }

    public function destroy(Account $account)
    {
        $account->delete();

        return redirect()->route('accounts.index');
    }
}
