<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('total_price');
            $table->unsignedBigInteger('amount_paid')->default(0);
            $table->unsignedBigInteger('remaining_balance')->default(0);
            $table->string('payment_method')->nullable();
            $table->foreignId('account_id')->nullable()->constrained()->onDelete('set null');
            $table->date('due_date')->nullable();
            $table->date('sale_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
