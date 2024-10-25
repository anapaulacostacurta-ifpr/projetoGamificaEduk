if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

function findTransactionByUid(uid) {
    showLoading();

    transactionService.findByUid(uid)
        .then(transaction => {
            hideLoading();
            if (transaction) {
                fillTransactionScreen(transaction);
                toggleSaveButtonDisable();
            } else {
                alert("Documento nao encontrado");
                window.location.href = "../home/home.html";
            }
        })
        .catch(() => {
            hideLoading();
            alert("Erro ao recuperar documento");
            window.location.href = "../home/home.html";
        });
}

function fillTransactionScreen(transaction) {
    if (transaction.type == "+") {
        form.typeAdd().checked = true;
    } else {
        form.typeSub().checked = true;
    }
    form.date().value = transaction.date;
    form.value().value = transaction.value;
    if (transaction.description) {
        form.description().value = transaction.description;
    }
}

function saveTransaction() {
    const transaction = createTransaction();

    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }
}

function save(transaction) {
    showLoading();

    transactionService.save(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar transaçao');
        })
}

function update(transaction) {
    showLoading();
    transactionService.update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao atualizar transaçao');
        });
}

function createTransaction() {
    return {
        type: form.typeAdd().checked ? "+" : "-",
        date: form.date().value,
        value: form.value().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? "block" : "none";

    form.valueLessOrEqualToZeroError().style.display = value <= 0 ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeDescription() {
    const description = form.description().value;
    form.descriptionRequiredError().style.display = !description ? "block" : "none";

    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const value = form.value().value;
    if (!value || value <= 0) {
        return false;
    }

    const description = form.description().value;
    if (!description) {
        return false;
    }

    return true;
}

const form = {
    date: () => document.getElementById('date'),
    description: () => document.getElementById('description'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById('save-button'),
    descriptionRequiredError: () => document.getElementById('description-required-error'),
    typeAdd: () => document.getElementById('add-coins'),
    typeSub: () => document.getElementById('sub-coins'),
    value: () => document.getElementById('value'),
    valueRequiredError: () => document.getElementById('value-required-error'),
    valueLessOrEqualToZeroError: () => document.getElementById('value-less-or-equal-to-zero-error')
}