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
        event.preventDefault();
    
        var transactionName = $('#transaction-name').val();
        var transactionAmount = parseFloat($('#transaction-amount').val());
        var reimbursementName = $('#payment-name').val();
        var reimbursementAmount = parseFloat($('#reimbursement-amount').val());
    
        $.ajax({
            url: '/save-transaction/',
            type: 'POST',
            data: {
                'transaction_name': transactionName,
                'transaction_amount': transactionAmount,
                'reimbursement_name': reimbursementName,
                'reimbursement_amount': reimbursementAmount,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                totalTransactionAmount += transactionAmount;
                totalReimbursementAmount += reimbursementAmount;
    
                updatePieChart();
                updateTransactionTable(transactionName, transactionAmount, reimbursementName, reimbursementAmount);
    
                if (!tableVisible) {
                    $('#transaction-table, .your-piggybnk').fadeIn();
                    tableVisible = true;
                }
            },
            error: function(error) {
                console.error("Error processing transaction:", error);
            }
        });
    
    });    
}) 