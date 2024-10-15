<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Umair Saif',
            'email' => 'umairsaif.pk@gmail.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'name' => 'Bilal Shafique',
            'email' => 'bilal@lgcookware.com',
            'password' => Hash::make('password'),
        ]);

    }
}
