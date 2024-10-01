// Valida o nome do produto
function dataValidationName(product) {
  if (typeof product.name !== "string") {
    return false;
  } else {
    return true;
  }
}

/* ---------------------------------------------- */
// Valida o preço do produto
function dataValidationPrice(product) {
    if (typeof product.price !== "number") {
      return false;
    } else {
      return true;
    }
  }

/* ---------------------------------------------- */
// Valida a quantidade do produto
  function dataValidationQuantity(product) {
    if (typeof product.quantity !== "number") {
      return false;
    } else {
      return true;
    }
  }

/* ---------------------------------------------- */
// Valida o peso do produto
  function dataValidationWeight(product) {
    if (typeof product.weight !== "number") {
      return false;
    } else {
      return true;
    }
  }

/* ---------------------------------------------- */
// Valida se o produto tem disponibilidade ou não
  function dataValidationDisponibility(product) {
    if (typeof product.disponibility !== "boolean") {
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