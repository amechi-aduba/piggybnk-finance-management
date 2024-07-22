$(document).ready(function() {
    let pieChart;
    let totalTransactionAmount = 0;
    let totalReimbursementAmount = 0;
    let remainingBalance = 0;
    let tableVisible = false;
    let accountBalances = {};

    // Function to initialize the pie chart
    function initializePieChart() {
        var ctx = document.getElementById('pie-chart').getContext('2d');
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Transactions', 'Total Account Balances'],
                datasets: [{
                    data: [totalTransactionAmount, totalReimbursementAmount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)', // Red for Transactions
                        'rgba(75, 192, 192, 0.7)', // Green for Account Balances
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
        let totalAccountBalance = 0;
        $.each(accountBalances, function(accountName, balance) {
            totalAccountBalance += balance;
        });

        if (pieChart) {
            pieChart.data.datasets[0].data = [totalTransactionAmount, totalAccountBalance];
            pieChart.update();
        }
    }

    // Function to update the remaining balance
    function updateRemainingBalance() {
        $('#remaining-balance').text(remainingBalance.toFixed(2));
        $('#remaining-balance-container').removeClass('hidden');

        if (remainingBalance < 0) {
            $('#remaining-balance-container').addClass('negative-balance');
            alert("Warning: Your remaining balance is below zero!");
        } else {
            $('#remaining-balance-container').removeClass('negative-balance');
        }
    }

    // Function to update the transaction table
    function updateTransactionTable(transactionName, transactionAmount) {
        var transactionTable = $('#transaction-table');
        var newRow = $('<tr></tr>');
        newRow.append('<td>' + transactionName + '</td>');
        newRow.append('<td>$' + transactionAmount.toFixed(2) + '</td>');
        transactionTable.find('tbody').append(newRow);
    }

    // Function to update the account balances list
    function updateAccountBalancesList() {
        var accountBalancesList = $('#account-balances-list');
        accountBalancesList.empty();

        $.each(accountBalances, function(accountName, balance) {
            var listItem = $('<li></li>');
            listItem.text(accountName + ': $' + balance.toFixed(2));
            accountBalancesList.append(listItem);
        });
    }

    // Initialize the pie chart
    initializePieChart();

    // Event listener for form submission
    $('#transaction-form').submit(function(event) {
        event.preventDefault();

        var transactionName = $('#transaction-name').val();
        var transactionAmount = parseFloat($('#transaction-amount').val()) || 0;
        var accountName = $('#account-name').val().trim().toLowerCase();
        var accountBalance = parseFloat($('#account-amount').val()) || 0;

        if (!accountName) {
            alert("Please enter a valid account name.");
            return;
        }

        // Update or add the account balance
        if (accountBalances[accountName]) {
            accountBalances[accountName] += accountBalance;
        } else {
            accountBalances[accountName] = accountBalance;
        }

        remainingBalance = accountBalances[accountName] - transactionAmount;

        $.ajax({
            url: '/save-transaction/',
            type: 'POST',
            data: {
                'transaction_name': transactionName,
                'transaction_amount': transactionAmount,
                'account_balance': accountBalance,
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(response) {
                totalTransactionAmount += transactionAmount;
                accountBalances[accountName] = remainingBalance; // Update account balance after transaction

                updatePieChart();
                updateRemainingBalance();
                updateTransactionTable(transactionName, transactionAmount);
                updateAccountBalancesList();

                if (!tableVisible) {
                    $('#transaction-table, .your-piggybnk').fadeIn();
                    $('#account-balances-container, account-balances-text').fadeIn();
                    tableVisible = true;
                }
            },
            error: function(error) {
                console.error("Error processing transaction:", error);
            }
        });
    });
});
