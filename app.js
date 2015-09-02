var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./Northwind.sl3');

db.serialize(function() {
  db.run('', function() {
    console.log('===========');
    console.log('Categories');
    console.log('===========');
  });
  getCategories();

  db.run('', function() {
    console.log('===========');
    console.log('Products');
    console.log('===========');
  });
  getProducts();

  db.run('', function() {
    console.log('=====================');
    console.log('Employee Supervisors');
    console.log('=====================');
  });
  getEmployeeSupers();

  db.run('', function() {
      console.log('=====================');
      console.log('Category Favorites');
      console.log('=====================');
    });
  deleteFavorite();
  createTable();
  addFavorites();
  updateFavorites();

});


function getCategories() {

  db.each('SELECT * FROM Categories', function(err, row) {
  console.log(row.Description.toString());
  });
};

function getProducts() {

  db.each('SELECT * FROM Products ' +
    'INNER JOIN Categories ' +
    'ON Products.CategoryID = Categories.CategoryID '+
    'LIMIT 10', function(err, row) {
      console.log(row.ProductName + ' is in the ' + row.CategoryName + ' department.');
    });
}


function getEmployeeSupers() {

  db.each('SELECT Employees.LastName AS Employee, Supervisors.LastName AS Supervisor ' +
    'FROM Employees ' +
    'LEFT OUTER JOIN Employees as Supervisors ' +
    'ON Employees.ReportsTo = Supervisors.EmployeeID', function(err, row) {
      if(row.Supervisor) {
        console.log(row.Employee + ' reports to ' + row.Supervisor);
      } else {
        console.log(row.Employee + ' has no supervisor.');
      }
    });
}

function createTable() {
  //1. create table CategoryFavorites with columns PK-FavoriteID [which auto increments] and CategoryID

  db.run('CREATE TABLE CategoryFavorites (FavoriteID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, CategoryID INTEGER NOT NULL)')

}

function addFavorites() {
//2. insert data categoryID 2,4,6,8
  db.run('INSERT INTO CategoryFavorites (CategoryID)' +
    'VALUES (2)');
  db.run('INSERT INTO CategoryFavorites (CategoryID)' +
    'VALUES (4)');
  db.run('INSERT INTO CategoryFavorites (CategoryID)' +
    'VALUES (6)');
  db.run('INSERT INTO CategoryFavorites (CategoryID)' +
    'VALUES (8)');
}



function getFavoriteDescriptions() {
  db.each('SELECT * FROM CategoryFavorites INNER JOIN Categories ON CategoryFavorites.CategoryID = Categories.CategoryID', function(err, row) {
    console.log('Category: ' + row.CategoryName + ' , Description: ' + row.Description.toString());
  });
}

function updateFavorites() {
  //4. CategoryFavorites ID2 from 4 to 5
  db.run('UPDATE CategoryFavorites ' +
  'SET CategoryID=5 ' +
  'WHERE FavoriteID=2');
  //5. redo #3
  getFavoriteDescriptions();
}

function deleteFavorite() {
  db.run('DROP TABLE CategoryFavorites');
}

db.close();
