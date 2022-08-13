const ssc = new SSC("https://api.hive-engine.com/rpc");
// ssc.getContractInfo((err, result) => {
// 		console.log(err, result);
// 	});

function sortDataByOcupation(data) {
  let dataSortbyOcupation = [];
  for (i in data) {
    if (data[i].properties.OCCUPIED === true) dataSortbyOcupation.push(data[i]);
  }
  return dataSortbyOcupation;
}

function sortOwners(data) {
  accounts = [];
  for (i in data) {
    accounts.push(data[i].account);
  }
  accounts = removeDuplicates(accounts);
  return accounts;
}

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

async function poupulateLandNftsInfo(region) {
  let regionData = []
  let i = 0
  while (regionData.length%1000 === 0){
  
  const data = await ssc.find(
    "nft",
    "HKFARMinstances",
    { "properties.NAME": `${region}` },
    1000,
    i,
    [],
    (err, result) => {
      console.log(err, result);
    }
  );
  regionData = regionData.concat(data)
  console.log(regionData.length)
  i = 1000 + i
  if (data.length<1000) {
	break
  }
  }
  console.log(regionData.length)
  const owners = sortOwners(regionData);
  const dataSortbyOcupation = sortDataByOcupation(regionData);

  console.log(dataSortbyOcupation.length);
  //we append elements in html
  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");
  const regionName = document.createElement("td");
  const plotsForRegion = document.createElement("td");
  const ocuppiedPlots = document.createElement("td");
  const ownersByRegion = document.createElement("td");
  regionName.textContent = `${region}`;
  plotsForRegion.textContent = regionData.length;
  ocuppiedPlots.textContent = dataSortbyOcupation.length;
  ownersByRegion.textContent = owners.length;
  row.append(region);
  row.append(plotsForRegion);
  row.append(ocuppiedPlots);
  row.append(ownersByRegion);
  tableBody.append(row);
}

async function poupulateLands (){
	await poupulateLandNftsInfo("Asia");
	await poupulateLandNftsInfo("South America");
	await poupulateLandNftsInfo("Jamaica");
	await poupulateLandNftsInfo("Afghanistan");
	await poupulateLandNftsInfo("Africa");
	poupulateLandNftsInfo("Mexico");

}

poupulateLands()