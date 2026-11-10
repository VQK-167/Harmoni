const interestModel = require("../../models/interestModel");

//lay danh sach so thich
async function getInterests(req, res){
  try{
    const interests = await interestModel.findAll();

    return res.json({
      success: true,
      message: "Lấy danh mục sở thích thành công",
      data: interests 
    });
  }
  catch(err){
    console.error("Lỗi lấy sở thích", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      data: null
    });
  }
}

module.exports = {
  getInterests
};