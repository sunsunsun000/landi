// 客房服务--燃气费

// 初始绑定搜索键盘事件
$(function(){
	$(".search-input").keydown(function(e){
		// 回车键
		if(e.keyCode==13){
            requestGas(this,parseInt(1));
		}
	})
});

var requestBeforeAndAfter = function(num,page){
    if(page<1) return;
    var totalpage = parseInt($("#gaslist_totalpage").text());
    if(page > totalpage) return;
    requestGas(num,page);
}


// 查询系统燃气费信息
var requestGas = function(num,pageNum){
	var type = 'gas';

	console.log("请求第"+ pageNum + "页燃气费信息");
	$.ajax({
		url:'/LD/userRoom/roomSearchSource.action',
		type:'post',
		contentType:'application/json',
		data:'{"type":"'+ type +'","pageNum":'+ pageNum + ',"rNum":"' + num +'"}',
		dataType:'json',
		success:function(data){
			console.log(data);
			if(data.State == "Invalid"){
                $("#gasTbody").append("<tr><td class='no-data' colspan='11' style='color: #ff4d4d'>"+
                    "您没有权限访问本页数据，请尝试升级权限或回退！</td></tr>");
				return;
			}
			else if(data.State == "Valid"){
				// 清空列表和页码
				$("#gasTbody").html("");
				$("#serviceGasBottom").html("");

				var pageNow = data.pageNow;
				var pageTotal = data.pageTotal;
				var recordTotal = data.recordTotal;

				if (recordTotal == 0) {
					$("#gasTbody").append("<tr><td class='no-data' colspan='11' style='color: #ff4d4d'>"+
						"没有相关数据！</td></tr>");
					return;
				}
							
				for(var i=0; i<data.pageList.length; i=i+2){
					var perRecord = data.pageList[i];
					var perRecord2 = data.pageList[i+1];


					$("#gasTbody").append("<tr><td>"+ perRecord.room_NUMBER +"</td>"+
						"<td>"+ perRecord.guest_NAME +"</td><td>"+ perRecord.meter +"</td>"+
						"<td>"+ perRecord.last_MONTH_VAL +"</td>"+
						"<td>"+ perRecord.money +"元</td><td>"+ perRecord.cur_MONTH_VAL +"</td>"+
						"<td>"+ perRecord.meter +"</td>"+
						"<td>"+ perRecord2.last_MONTH_VAL +"</td>"+
						"<td>"+ perRecord2.money +"元</td><td>"+ perRecord2.cur_MONTH_VAL +"</td>"+
						"<td>"+ formatDateForm(new Date(perRecord.cur_TIME)) +"</td></tr>");
				}	

				// 添加燃气费 底部页码
				$("#serviceGasBottom").append("<div class='bottom-page'>"+
			        	"<span class='page-before' onclick='requestBeforeAndAfter(\"" + num + "\"," + pageNum + "-1);'>上一页&nbsp;&nbsp;</span>"+
			        	"<span><input id='gaslist_nowpage' value='"+ pageNow +"' type='text' class='input_num'></span>"+
			        	"<span>&nbsp;/&nbsp;</span>"+
			        	"<span id='gaslist_totalpage'>"+ Math.ceil(pageTotal)+"</span>"+
			            "<span class='page-next' onclick='requestBeforeAndAfter(\"" + num + "\"," + pageNum + "+1);'>&nbsp;&nbsp;下一页</span>" +
			            "&nbsp;&nbsp;&nbsp;&nbsp;共<span class='recordTotal'>&nbsp;"+ Math.ceil(recordTotal/2) +"&nbsp;</span>条记录</div>");
			}
		}
	});
}


