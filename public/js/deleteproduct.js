document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", function () {
      var checkboxes = document.getElementsByName("deleteProduct");
      var selectedProducts = [];
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          selectedProducts.push(checkboxes[i].value);
        }
      }

      if (selectedProducts.length > 0) {
        fetch("/deleteproducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: selectedProducts }),
        })
          .then(function (response) {
            if (response.ok) {
              // Przekierowanie na stronę /allproducts
              window.location.href = "/allproducts";
              // Wyświetlenie popupa z informacją o sukcesie
              Swal.fire({
                title: "Sukces",
                text: "Produkty zostały usunięte",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              console.error("Błąd podczas usuwania produktów");
            }
          })
          .catch(function (error) {
            console.error("Błąd podczas wysyłania żądania:", error);
          });
      }
    });
});
