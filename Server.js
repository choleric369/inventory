const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;

MongoClient.connect('mongodb://127.0.0.1:27017',{useUnifiedTopology:true},(err,database)=>{
	if (err) return console.log(err)
	db=database.db('womens_fashion');
	app.listen(3000,()=>{
		console.log('Listening at port number 3000')
	})
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(req,res)=>{
	db.collection('clothing').find().toArray( (err,result)=>{
		if(err) return console.log(err)
		res.render('C:/Users/rcreddy/Desktop/Inventory/view/home.ejs',{data:result})
	})
})
//render only the page
app.get('/create',(req,res)=>{
	res.render('C:/Users/rcreddy/Desktop/Inventory/view/add.ejs')
})
//render only the page
app.get('/updatestock',(req,res)=>{
	res.render('C:/Users/rcreddy/Desktop/Inventory/view/update.ejs')
})
//render only the pages
app.get('/deleteproduct',(req,res)=>{
	res.render('C:/Users/rcreddy/Desktop/Inventory/view/delete.ejs')
})

//action done on add page after the information we get

app.post('/AddData',(req,res)=>{
	var Product_Id =req.body.Product_Id;
    var Catogery= req.body.Catogery;
    var Name= req.body.Name;
    var Brand= req.body.Brand;
    var Size= req.body.Size;
	var Quantity= parseInt(req.body.Quantity);
    var Cost_Price = req.body.Cost_Price;
    var Selling_Price = req.body.selling_price;
	var query={
        "Product_Id":Product_Id,
        "Catogery": Catogery,
        "Name": Name,
        "Brand": Brand,
        "Size": Size,
        "Quantity": Quantity,
        "Cost_Price": Cost_Price,
        "Selling_Price": Selling_Price
    };
	db.collection("clothing").insertOne(query, function(err, result) {
        if (err) throw err;
        console.log("1 document updated");
      });
      res.redirect('/');

	/*db.collection('clothing').save(req.body,(err,result)=>{
		if(err) return console.log(err)
		res.redirect('/') //as we need to show the added information should be showen on the homepage so the data is updated and retrive and the data on the homepage so we use redirect instead of render
	})*/
})

//update action

app.post('/update',(req,res)=>{
	db.collection("clothing").find({"Product_Id":req.body.Product_Id}).toArray((err, results) => {
		var res1=results;
		console.log(res1);
		console.log(res1[0].Quantity);
		db.collection('clothing').updateOne({Product_Id:req.body.Product_Id},{
			$set:{Quantity:res1[0].Quantity+parseInt(req.body.Quantity)}},{sort:{Product_Id:-1}},
			(err,result)=>{
				if(err) return console.log(err)
				console.log(req.body.Product_Id+' Price updated')
				res.redirect('/') 
			})
		})
	/*db.collection('clothing').save(req.body,(err,result)=>{
		if(err) return console.log(err)
		for(var i=0;i<result.length;i++){
			if(result[i].Product_Id==req.body.Product_Id){
				s=result[i].Quantity
				break
			}
		}
		console.log(s);
		db.collection('clothing').updateOne({Product_Id:req.body.Product_Id},{
		$set:{Quantity:parseInt(s)+parseInt(req.body.Quantity)}},{sort:{Product_Id:-1}},
		(err,result)=>{
			if(err) return console.log(err)
			console.log(req.body.Product_Id+' Price updated')
			res.redirect('/') 
		})
	})*/
})

//delete action


app.post('/delete',(req,res)=>{
	var Product_Id =req.body.Product_Id;
    var query={"Product_Id":Product_Id};
    db.collection("clothing").deleteOne(query, function(err, result) {
        if (err) throw err;
        console.log(result.Product_Id);
      });
      res.redirect('/');
	/*db.collection('clothing').findOneAndDelete({Product_Id:req.body.Product_Id},(err,res)=>{
		if(err) return console.log(err)
		res.redirect('/')
	})*/
})
	
	
	
	
	
	
	
	
	
		