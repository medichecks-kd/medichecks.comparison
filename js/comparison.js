// Comparable product status
function Comparable(src)
{
  _m("new Comparable");
  _m(" -- " + src);

  this.element = src;
  this.toggleWrap = src.querySelector('.toggleCompare--outer');
  this.toggle = src.querySelector('.toggleCompare--outer input');
  this.toggleLabel = src.querySelector('.toggleCompare--outer label');
  this.toggleCheckbox = src.querySelector('.toggleCompare--outer input');
  this.buttonDoCompare = src.querySelector('.doCompare');
  this.productName = src.querySelector('.card__title').innerText;
  this.productPrice = src.querySelector('.card__price').innerText;
  this.productID = this.toggleCheckbox.id;
  
  this.comparing = false;
  
  _m(" -- pid: " + this.productID);
  
  this.toggle.addEventListener('click', this.addRemoveCompare.bind(this, true));
  this.buttonDoCompare.addEventListener('click', showComparison);
}

// Toggle whether product is compared or not
Comparable.prototype.addRemoveCompare = function(update)
{
  _m(this.productID + ": addRemoveCompare()");

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

  if(update === true) {
      updateComparison();
  }
  checkLimit();
};

// Add to the comparison list
Comparable.prototype.addToCompare = function()
{
  // Add class to update UI
  // this.element.classList.add('comparing');
  _mc.addClass(this.element, 'comparing');
  
  // Stop hiding the comparison button
  // this.buttonDoCompare.classList.remove('hidden');
  _mc.removeClass(this.buttonDoCompare, 'hidden');
  
  // Update copy
  this.toggleLabel.innerText = 'Remove from compare';
};

// Remove from the comparison list
Comparable.prototype.removeFromCompare = function()
{
    _m("removeFromCompare()");
    // this.element.classList.remove('comparing');
    _mc.removeClass(this.element, 'comparing');

    // this.buttonDoCompare.classList.add('hidden');
    _mc.addClass(this.buttonDoCompare, 'hidden');

    this.toggleLabel.innerText = 'Compare';
    this.toggleCheckbox.checked = false;
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
  // container.classList.remove('hidden');
  _mc.removeClass(container, 'hidden');

  var btnClose = document.getElementById('comparison__button--close');
  btnClose.addEventListener('click', hideComparison);

  var btnClear = document.getElementById('comparison__button--clear');
  btnClear.addEventListener('click', clearAll);

}

// Reset the comparison
function clearAll()
{
    _m("clearing " + _comparison.toCompare.length);

    // Uncheck all comparing
    for(var i =0; i < _comparison.toCompare.length; i++)
    {
        var e = _comparison.toCompare[i];
        // e.toggleWrap.querySelector('input').checked = false;

        _m(e.productID + " is comparing: " + e.comparing);
        // e.comparing = false;

        // _m(e.productID + " is comparing: " + e.comparing);
        e.addRemoveCompare(false);

        // var e.querySelector('.toggleCompare').setAttribute('checked', false);
    }

    _comparison.toCompare = [];
    enableComparison();

    _m("cleared all " + _comparison.toCompare.length);

    // hideComparison();
}

function hideComparison()
{
  var container = document.getElementById('comparison__overlay');
  // container.classList.add('hidden');
  _mc.addClass(container, 'hidden');

  var btnClose = document.getElementById('comparison__button--close');
  btnClose.removeEventListener('click', hideComparison);
}

function populateComparison()
{
  var outerWrap = document.getElementById('comparison__results');
  
  // Clear previous results
  outerWrap.innerHTML = '';
  
  // Add product row
  outerWrap.appendChild( generateNameRow() );

  // Add price row
  outerWrap.appendChild( generatePriceRow() );

  var featureWrap = document.createElement('div');
  featureWrap.className = 'compareProduct--row comparisonFeatures--wrap';

  outerWrap.appendChild(featureWrap);

  // _m("Feature categories: " + _comparison.features.length);

  for(var i = 0; i < _comparison.features.length; i++)
  {
	  // _m("feature category " + i + ": " + _comparison.features[i].cat);
      var subCatRows = [];

	  for(var j = 0; j < _comparison.features[i].subcat.length; j++)
	  {
            // _m("-- subcat " + j + ": " + _comparison.features[i].subcat[j]);

            var featureSubCategoryRow = generateFeatureRow(i,j);
            if(featureSubCategoryRow !== false)
            {
                subCatRows.push( featureSubCategoryRow );
            }
	  }

	  // If sub categories are populated, create the category header row and sub category rows.
	  if(subCatRows.length > 0)
      {
          var featureCategoryRow = generateFeatureCategoryRow( _comparison.features[i].cat );
          featureWrap.appendChild(featureCategoryRow);

          for(var k = 0; k < subCatRows.length; k++)
          {
              featureWrap.appendChild( subCatRows[k] );
          }
      }

  }
}

function generateFeatureCategoryRow(categoryName)
{
    var row = document.createElement('div');
    row.className = "compareProduct--row compare__featureCategory";

    var col = document.createElement('div');
    col.className = "compareProduct--titleColumn textBold";
    col.innerHTML = categoryName;

    row.appendChild(col);

    return row;
}

function generateNameRow()
{
    // Create row for product information
    var productsRow = generateHeadingRow('compareProduct--names--outer');

    // Add spacer and content column
    var productsColOuter = addHeaderCols(productsRow);

    // Flex wrapper for product names
    var productsColInner = generateHeadingContentInner('compareProduct--names');

    // Nest the elements
    productsColOuter.appendChild(productsColInner);

    // Create heading row
    for(var i = 0; i < _comparison.toCompare.length; i++)
    {
        var product = _comparison.toCompare[i];
        var c = document.createElement('div');
        c.className = "compareProduct--value text-center";
        c.innerHTML = '<span class="compareProduct--name">' + product.productName + '</span>';

        productsColInner.appendChild(c);
    }
  
    return productsRow;
}

function generatePriceRow()
{
    // Create row for product information
    var productsRow = generateHeadingRow('compareProduct--prices--outer');

    var productsColOuter = addHeaderCols(productsRow);

    // Flex wrapper for product names
    var productsColInner = generateHeadingContentInner('compareProduct--prices');

    // Nest the elements
    productsColOuter.appendChild(productsColInner);

    // Create heading row
    for(var i = 0; i < _comparison.toCompare.length; i++)
    {
        var product = _comparison.toCompare[i];
        var c = document.createElement('div');
        c.className = "compareProduct--value text-center";
        c.innerHTML = '<span class="compareProduct--price">' + product.productPrice + '</span>';

        productsColInner.appendChild(c);
    }

    return productsRow;
}

// Adds title and values column to the row and returns the
// values element to be populated.
function addHeaderCols(headerRow)
{
    var spacerColumn = document.createElement('div');
    spacerColumn.className = 'compareProduct--titleColumn';

    var productsColOuter = document.createElement('div');
    productsColOuter.className = 'compareProduct--valueColumn';

    headerRow.appendChild(spacerColumn);
    headerRow.appendChild(productsColOuter);

    return productsColOuter;
}



// Create heading row for results table
function generateHeadingRow(id)
{
  // Create row for information
  var productsRow = document.createElement('div');
  productsRow.id = id;
  productsRow.className = 'compareProduct--row';

  return productsRow;
}

// Create column that will contain heading row content
// function generateHeadingContentOuter()
// {
// 	var productsColOuter = document.createElement('div');
// 	productsColOuter.className = 'col-xs-10 col-xs-offset-2';
// 	return productsColOuter;
// }

// Create inner flex wrapper for heading row content
function generateHeadingContentInner(id)
{
	var productsColInner = document.createElement('div');
	productsColInner.id = id;
	productsColInner.className = 'compareProduct--values';
	return productsColInner;
}


function generateFeatureRow(cat, subcat)
{
	// _m("generateFeatureRow()");
	// _m("-- " + cat + " | " + subcat);
	// _m("-- " + _comparison.features[cat].subcat[subcat]);

	// First, make sure at least one of the comparing products has
	// this feature.

	// Count of how many products contain this feature
	var featureCount = 0;
	var results = [];

	// Check whether each product has this feature
	for(var j = 0; j < _comparison.toCompare.length; j++)
	{
		// _m("-- Checking features of product " + _comparison.toCompare[j].productID);

		var productHasFeature = hasFeature( _comparison.features[cat].subcat[subcat], _comparison.toCompare[j] );

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
		row.className = 'compareProductInfo--row';

		// Create column to contain feature name
		var label = document.createElement('div');
		label.className = 'compareProduct--titleColumn compareProduct__featureSubCategory';
		label.innerHTML = _comparison.features[cat].subcat[subcat];
		row.appendChild(label);

		// Create column to contain feature tick boxes
		var productFeatureOuter = document.createElement('div');
		productFeatureOuter.className = 'compareProduct--valueColumn';
		row.appendChild(productFeatureOuter);

		// Create flex container for feature ticks
		var productFeatureInner = document.createElement('div');
		productFeatureInner.className = 'compareProduct--values';
		productFeatureOuter.appendChild(productFeatureInner);

		// Add product feature row
		for (var k = 0; k < results.length; k++) {
		  var product = document.createElement('div');
		  product.className = "compareProduct--value text-center";

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

// Check whether this product has the specified feature
function hasFeature(featureName, product)
{
	// _m("-- hasFeature()");

	// Get product data
	var pd = _comparison.productData[product.productID];

	// Search features
	var found = pd.productFeatures.indexOf(featureName);

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

// Settings
var _comparison = {
	products: [],
	toCompare: [],
	features : [
	    {
		    cat: "Red Blood Cells",
            subcat: [
                  "Haemoglobin",
                  "HCT",
                  "RBC",
                  "MCV",
                  "MCH",
                  "MCHC",
                  "RDW"
            ]
        },
        {
            cat:"White Blood Cells",
            subcat:[
              "White Cell Count",
              "Neutrophils",
              "Lymphocytes",
              "Monocytes",
              "Eosinophils",
              "Basophils",
              "Blood Film Report"
            ]
        },
        {
            cat:"Clotting Status",
            subcat:[
                "Platelet Count",
                "MPV"
            ]
        },
        {
            cat: "Kidney Function",
            subcat: [
                "Sodium",
                "Urea",
                "Creatinine"
            ]
        }
    ],
  productData : {
	ts754: {
	  name: "Product 1",
	  productFeatures: ["MPV","RBC","Neutrophils","MPV"]
	},
	ts580: {
	  name: "Product 2",
	  productFeatures: ["Platelet Count","Sodium"]
	},
	ts643: {
	  name: "Product 3",
	  productFeatures: ["Neutrophils","White Cell Count","Sodium"]
	},
	ts111197: {
	  name: "Product 4",
	  productFeatures: ["HCT","RBC","MCV",]
	},
	ts111347: {
	  name: "Product 5",
	  productFeatures: ["Sodium", "MPV"]
	},
	ts1318: {
	  name: "Product 6",
	  productFeatures: ["Monocytes","Eosinophils", "MPV"]
	},
	ts1114873: {
	  name: "Product 7",
	  productFeatures: ["Haemoglobin","HCT","RBC",]
	},
  },
  max: 4,         // Maximum products to compare
  overlay: true   // Display as overlay
}

$(document).ready(function() {
	initComparisonProducts();
});

// Brings in some useful common functions
var _mc = new Medichecks();