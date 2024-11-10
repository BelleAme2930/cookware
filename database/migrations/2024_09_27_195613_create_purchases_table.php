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
            $table->foreignId('account_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedBigInteger('total_price');
            $table->unsignedBigInteger('amount_paid')->default(0);
            $table->unsignedBigInteger('remaining_balance')->default(0);
            $table->date('due_date')->nullable();
            $table->unsignedBigInteger('weight')->nullable();
            $table->unsignedBigInteger('quantity')->nullable();
            $table->string('cheque_number')->nullable();
            $table->date('cheque_date')->nullable();
            $table->string('cheque_bank')->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->unsignedBigInteger('account_payment')->nullable();
            $table->unsignedBigInteger('cheque_amount')->nullable();
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
