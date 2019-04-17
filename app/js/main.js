/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var products = [
  {
    name: 'Couch',
    id: 'cch-blk-ma',
    price: 499.99,
    color: 'black',
    material: 'mahogany',
    description: 'A very comfy couch',
    quantity: 3
  },
  {
    name: 'Armchair',
    id: 'ac-gr-pin',
    price: 299.99,
    color: 'grey',
    material: 'pine',
    description: 'A plush recliner armchair',
    quantity: 7
  },
  {
    name: 'Stool',
    id: 'st-re-pin',
    price: 59.99,
    color: 'red',
    material: 'pine',
    description: 'A light, high-stool',
    quantity: 3
  },
  {
    name: 'Chair',
    id: 'ch-blu-pin',
    price: 49.99,
    color: 'blue',
    material: 'pine',
    description: 'A plain chair for the kitchen table',
    quantity: 1
  },
  {
    name: 'Dresser',
    id: 'dr-wht-ply',
    price: 399.99,
    color: 'white',
    material: 'plywood',
    description: 'A plain dresser with five drawers',
    quantity: 4
  },
  {
    name: 'Cabinet',
    id: 'ca-brn-ma',
    price: 799.99,
    color: 'brown',
    material: 'mahogany',
    description: 'An intricately-designed, antique cabinet',
    quantity: 11
  }
];

var idbApp = (function() {
  'use strict';

  // TODO 2 - check for support

  var dbPromise = idb.open('couches-n-things', 4, function(upgradeDb) {
    switch(upgradeDb.oldVersion) {
      case 0:
        //placeholder
      case 2: 
        console.log('Creating products store');
        var productsStore = upgradeDb.createObjectStore('products', {keyPath: 'id'});
        console.log('Creating product indexes');
      case 3:
        var prodNameIndex = productsStore.createIndex('name', 'name', {unique: true});
        var prodPriceIndex = productsStore.createIndex('price', 'price');
        var prodDescriptionIndex = productsStore.createIndex('description', 'description');

        console.log('Creating orders store');
        var ordersStore = upgradeDb.createObjectStore('objects', {keyPath: 'id'});
    }
  });

  function addProducts() {

    // TODO 3.3 - add objects to the products store
    console.log('Add the following products:');
    console.log(products);

    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readwrite');
      var store = tx.objectStore('products');

      return Promise.all(products.map(function(item) {
        console.log('Adding item...');
        console.log(item);
        return store.add(item);
      })
      ).catch(function(e) {
        console.log('There was an error: ', e);
      }).then(function() {
        console.log('All products added successfully.');
      });

    });

  }

  function getByName(key) {

    // TODO 4.3 - use the get method to get an object by name
    return dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      var index = store.index('name');
      return index.get(key);
    });

  }

  function displayByName() {
    var key = document.getElementById('name').value;
    if (key === '') {return;}
    var s = '';
    getByName(key).then(function(object) {
      if (!object) {return;}

      s += '<h2>' + object.name + '</h2><p>';
      for (var field in object) {
        s += field + ' = ' + object[field] + '<br/>';
      }
      s += '</p>';

    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }

  function getByPrice() {

    var upper, lower, lowerNum, upperNum, range, s;

    // TODO 4.4a - use a cursor to get objects by price
    lower = document.getElementById('priceLower').value;
    upper = document.getElementById('priceUpper').value;
    lowerNum = Number(lower);
    upperNum = Number(upper);

    if (lower === '' && upper === '') {
      console.log('Both upper and lower are blank.');
      return;
    }

    console.log('Find items priced ', lower, ' - ', upper);
    
    if(lower !== '' & upper !== '') {
      range = IDBKeyRange.bound(lowerNum, upperNum);
    } else if (lower === '') {
      range = IDBKeyRange.upperBound(upperNum);
    } else {
      range = IDBKeyaRange.lowerBound(lowerNum);
    }

    s = '';

    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      var index = store.index('price');
      return index.openCursor(range);
    }).then(function showRange(cursor) {
      if(!cursor) {
        console.log('No cursor.');
        return;
      }
      console.log('cursored at:', cursor.value.name);
      s += `<h2>Price - ${cursor.value.price}</h2><p>`;
      for (var field in cursor.value) {
        s = `${s}${field}=${cursor.value[field]}<br/>`
      }
      s += '</p>';
      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {
        s = '<p>No results</p>'
      }
      document.getElementById('results').innerHTML = s;
    });



  }

  function getByDesc() {
    var key = document.getElementById('desc').value;
    if (key === '') {return;}
    var range = IDBKeyRange.only(key);
    var s = '';
    dbPromise.then(function(db) {

      // TODO 4.4b - get items by their description

    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }

  function addOrders() {

    // TODO 5.2 - add items to the 'orders' object store

  }

  function showOrders() {
    var s = '';
    dbPromise.then(function(db) {

      // TODO 5.3 - use a cursor to display the orders on the page

    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('orders').innerHTML = s;
    });
  }

  function getOrders() {

    // TODO 5.4 - get all objects from 'orders' object store

  }

  function fulfillOrders() {
    getOrders().then(function(orders) {
      return processOrders(orders);
    }).then(function(updatedProducts) {
      updateProductsStore(updatedProducts);
    });
  }

  function processOrders(orders) {

    // TODO 5.5 - get items in the 'products' store matching the orders

  }

  function decrementQuantity(product, order) {

    // TODO 5.6 - check the quantity of remaining products

  }

  function updateProductsStore(products) {
    dbPromise.then(function(db) {

      // TODO 5.7 - update the items in the 'products' object store

    }).then(function() {
      console.log('Orders processed successfully!');
      document.getElementById('receipt').innerHTML =
      '<h3>Order processed successfully!</h3>';
    });
  }

  return {
    dbPromise: (dbPromise),
    addProducts: (addProducts),
    getByName: (getByName),
    displayByName: (displayByName),
    getByPrice: (getByPrice),
    getByDesc: (getByDesc),
    addOrders: (addOrders),
    showOrders: (showOrders),
    getOrders: (getOrders),
    fulfillOrders: (fulfillOrders),
    processOrders: (processOrders),
    decrementQuantity: (decrementQuantity),
    updateProductsStore: (updateProductsStore)
  };
})();
