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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('total_price');
            $table->unsignedBigInteger('semi_credit_amount')->default(0);
            $table->unsignedBigInteger('remaining_balance')->default(0);
            $table->string('payment_method')->nullable();
            $table->foreignId('account_id')->nullable()->constrained()->onDelete('set null');
            $table->date('due_date')->nullable();
            $table->date('purchase_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
