$(document).ready(function() {
    let pieChart;
    let totalTransactionAmount = 0;
    let totalReimbursementAmount = 0;
    let tableVisible = false;

    // Function to initialize the pie chart
    function initializePieChart() {
        var ctx = document.getElementById('pie-chart').getContext('2d');
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Transactions', 'Reimbursements'],
                datasets: [{
                    data: [totalTransactionAmount, totalReimbursementAmount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)', // Red for Transactions
                        'rgba(75, 192, 192, 0.7)', // Green for Reimbursements
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                // Add additional options as needed
            }
        });
    }

    // Function to update the pie chart
    function updatePieChart() {
        if (pieChart) {
            pieChart.data.datasets[0].data = [totalTransactionAmount, totalReimbursementAmount];
            pieChart.update();
        }
    }

    // Function to update the transaction table
    function updateTransactionTable(transactionName, transactionAmount, reimbursementName, reimbursementAmount) {
        var transactionTable = $('#transaction-table');
        var newRow = $('<tr></tr>');
        newRow.append('<td>' + transactionName + '</td>');
        newRow.append('<td>$' + transactionAmount.toFixed(2) + '</td>');
        newRow.append('<td>' + reimbursementName + '</td>');
        newRow.append('<td>$' + reimbursementAmount.toFixed(2) + '</td>');
        transactionTable.find('tbody').append(newRow);
    }

    // Initialize the pie chart
    initializePieChart();

    // Event listener for form submission
    $('#transaction-form').submit(function(event) {
        event.preventDefault(); // Prevent default form submission
    
        // Get transaction data from form inputs
        var transactionName = $('#transaction-name').val();
        var transactionAmount = parseFloat($('#transaction-amount').val());
        var reimbursementName = $('#payment-name').val();
        var reimbursementAmount = parseFloat($('#reimbursement-amount').val());
    
        // AJAX backend request to send data to the server
        $.ajax({
            url: '/finance/save-transaction/', // Replace with your Django view URL
            type: 'POST',
            data: {
                'transaction_name': transactionName,
                'transaction_amount': transactionAmount,
                'reimbursement_name': reimbursementName,
                'reimbursement_amount': reimbursementAmount,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val() // CSRF token
            },
            success: function(response) {
                // Update total transaction and reimbursement amounts
                totalTransactionAmount += transactionAmount;
                totalReimbursementAmount += reimbursementAmount;
    
                // Fade in the table and your-piggybnk if it's the first submission
                if (!tableVisible) {
                    $('#transaction-table, .your-piggybnk').fadeIn();
                    tableVisible = true;
                }
    
                // Update the pie chart and transaction table with new data
                updatePieChart();
                updateTransactionTable(transactionName, transactionAmount, reimbursementName, reimbursementAmount);
            },
            error: function(error) {
                // Handle error
                console.error("Error processing transaction:", error);
            }
        });
    
        // Reset form inputs
        $('#transaction-form')[0].reset();
    });
}) 