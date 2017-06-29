// Comparable product status
function Comparable(src)
{
  _m("new Comparable");
  _m(" -- " + src);

  this.element = src;
  this.toggleWrap = src.querySelector('.toggleCompare');
  this.toggle = src.querySelector('.toggleCompare input');
  this.toggleLabel = src.querySelector('.toggleCompare label');
  this.buttonDoCompare = src.querySelector('.doCompare');
  this.productName = src.querySelector('.card__title').innerText;
  this.productPrice = src.querySelector('.card__price').innerText;
  this.productID = this.toggleWrap.querySelector('input').id;
  
  this.comparing = false;
  
  _m(" -- pid: " + this.productID);
  
  this.toggle.addEventListener('click', this.addRemoveCompare.bind(this));
  this.buttonDoCompare.addEventListener('click', showComparison);
}

// Toggle whether product is compared or not
Comparable.prototype.addRemoveCompare = function()
{
  hideComparison();
  enableComparison();

  this.comparing = !this.comparing;

  if(this.comparing === true)
  {
    this.addToCompare();    
  }
  else
  {
    this.removeFromCompare();    
  }

  updateComparison();
  checkLimit();
};

// Add to the comparison list
Comparable.prototype.addToCompare = function()
{
  // Add class to update UI
  this.element.classList.add('comparing');
  
  // Stop hiding the comparison button
  this.buttonDoCompare.classList.remove('hidden');
  
  // Update copy
  this.toggleLabel.innerText = 'Remove from compare';
};

// Remove from the comparison list
Comparable.prototype.removeFromCompare = function()
{
  this.element.classList.remove('comparing');
  this.buttonDoCompare.classList.add('hidden');
  this.toggleLabel.innerText = 'Compare';
};

// Ensure no more than the maximum can be selected
function checkLimit()
{
  // If limit is reached, disallow any more products being added
  if(_comparison.toCompare.length === _comparison.max)
  {
    // Do not allow any more products to be compared
    disableComparison();
  }
}

// Enable the Compare toggles
function enableComparison()
{
  // _m("enableComparison");
  
  for(var i = 0; i < _comparison.products.length; i++)
  {    
    var p = _comparison.products[i];
    p.toggle.disabled = false;
  }
}

// Disable the Compare toggles as maximum reached
function disableComparison()
{
  // _m("disableComparison");
  
  for(var i = 0; i < _comparison.products.length; i++)
  {    
    var p = _comparison.products[i];
    
    if(p.comparing === false)
    {
      p.toggle.disabled = true;
    }
  }
}

// Update the comparison table
function updateComparison()
{  
  _m("updateComparison");
  
  _comparison.toCompare = [];
  
  for(var i = 0; i < _comparison.products.length; i++)
  {
    var ce = _comparison.products[i];
    // _m("product " + i + ": comparing = " + ce.comparing);
    
    if(ce.comparing === true)
    {
      _comparison.toCompare.push(ce);
    } 
  }
  
  updateDoCompareButtons();  
  populateComparison();
}

// Update the do compare buttons to reflect the
// number of items selected
function updateDoCompareButtons()
{
  var btns = document.querySelectorAll('.doCompare');
  var count = _comparison.toCompare.length;
  
  for(var i = 0; i < btns.length; i++)
  {
    var btn = btns[i];
    btn.innerText = "Compare " + count + " of " + _comparison.max + " products";
    
    // Disable button if only one product selected
    btn.disabled = (count === 1) ? true : false;    
    
  }
}

// Populate the comparison chart and show it
function showComparison()
{
  populateComparison();

  var container = document.getElementById('comparison__overlay');
  container.classList.remove('hidden');

  var btnClose = document.getElementById('comparison__button--close');
  btnClose.addEventListener('click', hideComparison);

}

function hideComparison()
{
  var container = document.getElementById('comparison__overlay');
  container.classList.add('hidden');

  var btnClose = document.getElementById('comparison__button--close');
  btnClose.removeEventListener('click', hideComparison);
}

function populateComparison()
{
  var outerWrap = document.getElementById('comparison__results');
  
  // Clear previous results
  outerWrap.innerHTML = '';
  
  // Add product row
  outerWrap.appendChild( generateProductsRow() );

  // Add price row
  outerWrap.appendChild( generatePriceRow() );

    for(var i = 0; i < _comparison.features.length; i++)
    {
        var row = generateFeatureRow(i);
        if(row !== false)
        {
          outerWrap.appendChild( row );
        }
    }
}

function generateProductsRow()
{
  // Create row for product information
  var productsRow = generateHeadingRow('productsToCompare');

  // Column to contain product names
  var productsColOuter = generateHeadingContentOuter();

  // Flex wrapper for product names
  var productsColInner = generateHeadingContentInner('compareProduct--names');

  // Nest the elements
  productsRow.appendChild(productsColOuter);
  productsColOuter.appendChild(productsColInner);

  // Create heading row
  for(var i = 0; i < _comparison.toCompare.length; i++)
  {    
    var product = _comparison.toCompare[i];
    var c = document.createElement('div');
    c.className = "compareProduct--name flex1 text-center";
    c.innerHTML = "<h3>" + product.productName + "</h3>";
    
    productsColInner.appendChild(c);    
  }
  
  return productsRow;
}

function generatePriceRow()
{
    // Create row for product information
    var productsRow = generateHeadingRow('compareProduct--prices');

    // Column to contain product names
    var productsColOuter = generateHeadingContentOuter();

    // Flex wrapper for product names
    var productsColInner = generateHeadingContentInner('compareProduct--price');

    // Nest the elements
    productsRow.appendChild(productsColOuter);
    productsColOuter.appendChild(productsColInner);

    // Create heading row
    for(var i = 0; i < _comparison.toCompare.length; i++)
    {
        var product = _comparison.toCompare[i];
        var c = document.createElement('div');
        c.className = "compareProduct--price flex1 text-center";
        c.innerHTML = product.productPrice;

        productsColInner.appendChild(c);
    }

    return productsRow;
}

// Create heading row for results table
function generateHeadingRow(id)
{
  // Create row for information
  var productsRow = document.createElement('div');
  productsRow.id = id;
  productsRow.classList = 'row compareProduct--header';

  return productsRow;
}

// Create column that will contain heading row content
function generateHeadingContentOuter()
{
    var productsColOuter = document.createElement('div');
    productsColOuter.classList = 'col-xs-10 col-xs-offset-2';
    return productsColOuter;
}

// Create inner flex wrapper for heading row content
function generateHeadingContentInner(id)
{
    var productsColInner = document.createElement('div');
    productsColInner.id = id;
    productsColInner.classList = 'flex';
    return productsColInner;
}


function generateFeatureRow(featureId)
{
    // First, make sure at least one of the comparing products has
    // this feature.

    // Count of how many products contain this feature
    var featureCount = 0;

    // Store whether product has this feature
    var results = [];

    for(var j = 0; j < _comparison.toCompare.length; j++)
    {
      var productHasFeature = hasFeature(featureId, _comparison.toCompare[j]);
      if(productHasFeature === true)
      {
        featureCount++;
        results.push(true);
      }
      else
      {
        results.push(false);
      }
    }

    // If no products have this feature then abandon.
    if(featureCount === 0)
    {
    return false;
    }
    else {

      // Create row to contain a feature
      var row = document.createElement('div');
      row.className = 'row compareProductInfo--row';

      // Create column to contain feature name
      var label = document.createElement('div');
      label.classList = 'col-xs-2 compareProductInfo--col';
      label.innerHTML = _comparison.features[featureId];
      row.appendChild(label);

      // Create column to contain feature tick boxes
      var productFeatureOuter = document.createElement('div');
      productFeatureOuter.classList = 'col-xs-10';
      row.appendChild(productFeatureOuter);

      // Create flex container for feature ticks
      var productFeatureInner = document.createElement('div');
      productFeatureInner.classList = 'flex';
      productFeatureOuter.appendChild(productFeatureInner);


      // Add product feature row
      for (var k = 0; k < results.length; k++) {
          var product = document.createElement('div');
          product.className = "compareProduct--feature flex1 text-center";

          if (results[k] === true) {
              product.innerHTML = '<span class="success">Y</span>';
          }

          productFeatureInner.appendChild(product);
      }

      // If at least one product has this feature, return the
      // row, otherwise return false.
      return row;
    }
}

function hasFeature(feature, product)
{
  var pd = _comparison.productData[product.productID];
  
  // Search features
  var found = pd.features.indexOf(feature);

  return (found >= 0) ? true : false;
}

// Scan document for all comparable items and create Comparable
// object for them
function initComparisonProducts()
{
  var comparables = document.querySelectorAll('.comparable');

  _m("Found " + comparables.length +" products to compare");

  for(var i = 0; i < comparables.length; i++)
  {
    var ce = comparables[i];    
    var c = new Comparable(ce);
    _comparison.products.push(c);
  }   
}

// Returns whether element has the specified class
function hasClass(className)
{
  if (el.classList)
    return el.classList.contains(className);
  else
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

/** Debugging **/

function _m(msg)
{
  console.log(msg);
}

// Settings
var _comparison = {
  products: [],
  toCompare: [],
  features : [
      "Red Blood Cells",
      "Haemoglobin",
      "White Blood Cells",
      "White Cell Count",
      "Neutrophils",
      "Lymphocytes",
      "Monocytes",
      "Eosinophils",
      "Basophils",
      "Blood Film Report",
      "Clotting Status",
      "Kidney Function"

    ],
  productData : {
    ts754: {
      name: "Product 1",
      features: [1,4,5,7,8]
    },
    ts580: {
      name: "Product 2",
      features: [0,1,2,3,4,5,6]
    },
    ts643: {
      name: "Product 3",
      features: [0,1,2,3]
    },
    ts111197: {
      name: "Product 4",
      features: [1,5,6]
    },
    ts111347: {
      name: "Product 5",
      features: [0,1,2,3,4]
    },
    ts1318: {
      name: "Product 6",
      features: [1,3,5,7]
    },
    ts1114873: {
      name: "Product 7",
      features: [1,3,5,7]
    },
  },
  max: 4,         // Maximum products to compare
  overlay: true   // Display as overlay
}

$(document).ready(function() {
    initComparisonProducts();
});
