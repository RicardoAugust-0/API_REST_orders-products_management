// Valida o nome do produto
function dataValidationName(product) {
  if (typeof product.nome !== "string") {
    return false;
  } else {
    return true;
  }
}

/* ---------------------------------------------- */
// Valida o preço do produto
function dataValidationPrice(product) {
    if (typeof product.preco !== "number") {
      return false;
    } else {
      return true;
    }
  }

/* ---------------------------------------------- */
// Valida a quantidade do produto
  function dataValidationQuantity(product) {
    if (typeof product.quantidade !== "number") {
      return false;
    } else {
      return true;
    }
  }

/* ---------------------------------------------- */
// Valida o peso do produto
  function dataValidationWeight(product) {
    if (typeof product.peso !== "number") {
      return false;
    } else {
      return true;
    }
  }

/* ---------------------------------------------- */
// Valida se o produto tem disponibilidade ou não
  function dataValidationDisponibility(product) {
    if (typeof product.disponibilidade !== "boolean") {
      return false;
    } else {
      return true;
    }
  }

module.exports = {
  dataValidationName,
  dataValidationPrice,
  dataValidationQuantity,
  dataValidationWeight,
  dataValidationDisponibility
};