var i=3;
var att_val_code= "<input type='text' class='att'>";
var att_val_type= "<select class='att_type'><option value='String'>String</option><option value='Integer'>Integer</option><option value='Short'>Short</option><option value='Long'>Long</option><option value='Date'>Date</option></select>";
var is_key_code="<input type='checkbox' class='isKey' value='1'>"

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function addAttribute()
{
	var table = document.getElementById("modelDetail");
   var row = table.insertRow(i);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   var cell4 = row.insertCell(3);
   var cell5 = row.insertCell(4);
   var cell6 = row.insertCell(5);
   cell1.innerHTML = "Attribute Name : "
   cell2.innerHTML = att_val_code;
   cell3.innerHTML = "Attribute Type : ";
   cell4.innerHTML = att_val_type;
   cell5.innerHTML = "Is Key : ";
   cell6.innerHTML = is_key_code;
   i++;
}

function remAttribute()
{
	if (i==3) {return;}
	document.getElementById("modelDetail").deleteRow(i-1);
	i--;
}

function getAddQuery()
{
	var tableName=document.getElementById("model").value;
	var attributes= document.getElementsByClassName("att");
	var flag=false;
	
	//SQL generation
	var sql="\"Insert into "+tableName.toUpperCase() +"(";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
		flag=true;
		sql+=attributes[i].value.replace(/ /g, "").toLowerCase()+", ";
	}
	if(flag) sql=sql.substr(0,sql.length-2);
	flag=false;
	sql+=") values(";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
		flag=true;
		sql+="'\"+"+attributes[i].value.replace(/ /g, "").toLowerCase()+"+\"', ";
	}
	if(flag) sql=sql.substr(0,sql.length-5);
	sql+="+\"')\"";
	return sql;
}

function getRemoveQuery()
{
	var tableName=document.getElementById("model").value;
	var attributes= document.getElementsByClassName("att");
	var isKey= document.getElementsByClassName("isKey");
	var flag=false;	
	//SQL Generation
	var sql="\"Delete from "+tableName.toUpperCase()+" where ";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="" || !isKey[i].checked) continue;
		flag=true;
		sql+= attributes[i].value.replace(/ /g, "").toLowerCase()+"='\"+"+attributes[i].value.replace(/ /g, "").toLowerCase()+"+\"' AND ";
	}
	if(flag) sql=sql.substr(0,sql.length-5);
	return sql+="\"";
}

function getUpdateQuery()
{
	var tableName=document.getElementById("model").value;
	var attributes= document.getElementsByClassName("att");
	var isKey= document.getElementsByClassName("isKey");
	var flag=false;
	
	//SQL Generation
	var sql="\"Update "+tableName.toUpperCase() + " set " ;
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="" || isKey[i].checked) continue;
		flag=true;
		sql+= attributes[i].value.replace(/ /g, "").toLowerCase()+"='\"+"+attributes[i].value.replace(/ /g, "").toLowerCase()+"+\"', ";
	}
	if(flag) sql=sql.substr(0,sql.length-2);
	sql+=" where ";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="" || !isKey[i].checked) continue;
		flag=true;
		sql+= attributes[i].value.replace(/ /g, "").toLowerCase()+"='\"+"+attributes[i].value.replace(/ /g, "").toLowerCase()+"+\"' AND ";
	}
	if(flag) sql=sql.substr(0,sql.length-5);
	return sql+="\"";
	
	return sql;
}

function getFindByIdQuery()
{
	var tableName=document.getElementById("model").value;
	var attributes= document.getElementsByClassName("att");
	var isKey= document.getElementsByClassName("isKey");
	var flag=false;
	
	var sql="\"Select * from "+tableName.toUpperCase() + " where ";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="" || !isKey[i].checked) continue;
		flag=true;
		sql+= attributes[i].value.replace(/ /g, "").toLowerCase()+"='\"+"+attributes[i].value.replace(/ /g, "").toLowerCase()+"+\"' AND ";
	}
	if(flag) sql=sql.substr(0,sql.length-5);
	return sql+="\"";
	
}

function genCode()
{
	//Data Collection
	var package_name=document.getElementById("package");
	var database=document.getElementById("database");
	var model=document.getElementById("model");
	var attributes= document.getElementsByClassName("att")
	var att_type= document.getElementsByClassName("att_type")
	var isKey= document.getElementsByClassName("isKey")
	
	//Source Generation
	var source_code="<code>package "+package_name.value.toLowerCase()+";</br></br>";
	source_code+="import "+database.value+";</br>";
	source_code+="import java.sql.ResultSet;<br>import java.util.ArrayList;<br>import java.util.Date;<br>";
	source_code+="<br>public class "+	model.value + "{<br>";
	
	//Adding Parameters
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
			source_code+="private "+att_type[i].value + " "+ attributes[i].value.replace(/ /g, "").toLowerCase()+ "; <br>";
	}
	//Adding Constructor
	var flag=false;
	source_code+="<br>"+model.value+"() {<br>}<br>";
	source_code+="<br>"+model.value+"(";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="" || !isKey[i].checked) continue;
		flag=true;
		source_code+= att_type[i].value +" "+ attributes[i].value.replace(/ /g, "").toLowerCase()+", ";
	}
	if(flag)	source_code=source_code.substr(0,source_code.length-2);
	source_code+=") {<br>";
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="" || !isKey[i].checked) continue;
		source_code+= "this."+attributes[i].value.replace(/ /g, "").toLowerCase()+"="+attributes[i].value.replace(/ /g, "").toLowerCase()+";<br>";
	} 
	source_code+="}<br>";
	
	//Adding Getters
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
			source_code+="<br>public "+att_type[i].value+" get"+attributes[i].value.replace(/ /g, "").toLowerCase().capitalize()+"() { <br>";
			source_code+= "return "+attributes[i].value.replace(/ /g, "").toLowerCase()+";<br>";
			source_code+="}<br>";
	}
	
	//adding Setters
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
			source_code+="<br>public void set"+attributes[i].value.replace(/ /g, "").toLowerCase().capitalize()+"("+att_type[i].value+" "+ attributes[i].value.replace(/ /g, "").toLowerCase()+") { <br>";
			source_code+= "this."+attributes[i].value.replace(/ /g, "").toLowerCase()+"="+attributes[i].value.replace(/ /g, "").toLowerCase()+";<br>";
			source_code+="}<br>";
	}
	
	//CRUD Operation
	source_code+="<br>public void add() {<br>dbConnection data = new dbConnection();<br>data.open();<br>data.executeUpdate(";
	source_code+=getAddQuery();
	source_code+=");<br>data.close();<br>}<br>";
	
	source_code+="<br>public void update() {<br>dbConnection data = new dbConnection();<br>data.open();<br>data.executeUpdate(";
	source_code+=getUpdateQuery();
	source_code+=");<br>data.close();<br>}<br>";
	
	source_code+="<br>public void remove() {<br>dbConnection data = new dbConnection();<br>data.open();<br>data.executeUpdate(";
	source_code+=getRemoveQuery();
	source_code+=");<br>data.close();<br>}<br>";
	
	source_code+="<br>public void findById() {<br>dbConnection data = new dbConnection();<br>data.open();<br>ResultSet rs=data.executeQuery(";
	source_code+=getFindByIdQuery();
	source_code+=");<br>try{<br>if(rs.next())<br>{<br>";
	var j=1;
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
		source_code+=attributes[i].value.replace(/ /g, "").toLowerCase()+"=rs.get"+att_type[i].value+"("+j+");<br>";
		j++;
	}
	source_code+="}<br>else<br>{";
	//set NULL
	source_code+="}<br>}<br>catch(SQLException e)<br>{System.out.println(e.toString());}<br>data.close();<br>}<br>";
	
	source_code+="public ArrayList&lt"+model.value+"&gt find(String cond) {<br>ArrayList&lt"+model.value+"&gt al = new ArrayList&lt"+model.value+"&gt();<br>"+model.value+" obj;<br>dbConnection data = new dbConnection();<br>data.open();<br>ResultSet rs=data.executeQuery(cond);<br>try{<br>while(rs.next())<br>{<br>obj = new "+model.value+"();<br>";
	j=1;
	for (var i = 0 ; i< attributes.length; i++) {
		if(attributes[i].value=="") continue;
		source_code+="obj.set"+attributes[i].value.replace(/ /g, "").toLowerCase().capitalize()+"(rs.get"+att_type[i].value+"("+j+"));<br>";
		j++;
	}	
	source_code+="al.add(obj);<br>}<br>}<br>catch(SQLException e)<br>{<br>System.out.println(e.toString());<br>}<br>data.close();<br>return al;<br>}<br>";
	
	
	source_code+="}</code>";
	//Source Display
	var src_area=document.getElementById("src");
	src.innerHTML=source_code;
	
}