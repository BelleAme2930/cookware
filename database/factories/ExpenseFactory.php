<?php

namespace Database\Factories;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'amount' => $this->faker->numberBetween(100, 1000),
            'description' => $this->faker->paragraph,
            'expense_date' => $this->faker->date(),
        ];
    }
}
