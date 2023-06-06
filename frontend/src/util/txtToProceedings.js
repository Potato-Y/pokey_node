const txtDownload = (roomName, txt) => {
  //   this.txt.push({
  //     date: getDate,
  //     name: info.name,
  //     translation: translation,
  //   });
  var content = "";
  console.log(txt);

  const date = new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const dateStr = year + "-" + month + "-" + day;

  content += contentAdd(`${dateStr} ${roomName}`);
  content += "\n";

  txt.forEach((item) => {
    var itemDate = new Date(item.date);

    const itemHours = ("0" + itemDate.getHours()).slice(-2);
    const itemMinutes = ("0" + itemDate.getMinutes()).slice(-2);

    content += contentAdd(
      `[${itemHours}:${itemMinutes}] ${item.name}: ${item.translation}`
    );
  });

  var fileDownload = require("js-file-download");
  fileDownload(content, `${dateStr}_${roomName}.txt`);
};

const contentAdd = (txt) => {
  return txt + "\n";
};

export default txtDownload;
