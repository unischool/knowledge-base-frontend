import{d as B,r as a,a as f,c as n,b as e,e as y,F as b,g as h,t as r,h as k,i as A,w,v as R,f as j,o as d,_ as K}from"./index-CPmO6FBk.js";const P=B({name:"AdminPanelView",setup(){const s=a(""),l=a(null),g=a(null),$=u=>{const o=u.target;if(o.files&&o.files[0]){const p=o.files[0];if(!["application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/pdf","image/jpeg","image/png","audio/ogg","audio/wav","audio/mpeg"].includes(p.type)){alert("請只上傳：doc, xls, pdf, jpg, oog, png, wav, mp3 的檔案格式"),o.value="",g.value=null;return}g.value=p}},c=a([]),m=a(!1),t=a(""),v=a([]),C=a(!1),I=a(""),V=a(""),N=a([]),z=a(!1),E=a(""),F=a(""),D=a(""),T=a([]),L=a(!1),G=a("");return{indexName:s,fileInput:l,selectedFile:g,handleFileChange:$,uploadResult:c,isUploadLoading:m,uploadError:t,uploadToGoogleDriveReady:async()=>{var u;if(!g.value){alert("請選擇檔案");return}m.value=!0,t.value="",c.value=[];try{const o=new FormData;o.append("file",g.value),console.log("selectedFile.value.name:",g.value.name),console.log("selectedFile.value.type:",g.value.type),console.log("selectedFile.value.size:",g.value.size),console.log("formData:",o),console.log('formData.get("file"):',o.get("file"));const p=await f.post("https://knowledge-base-backend.leechiuhui.workers.dev/uploadToGoogleDriveReady",o,{headers:{"Content-Type":"multipart/form-data"}});console.log("response:",p),console.log("response.data:",p.data),c.value=[{status:"成功",message:"檔案已上傳至準備區"}]}catch(o){console.log("err:",o),console.error(o);const i=(u=o.response)==null?void 0:u.data;t.value=(i==null?void 0:i.message)||"上傳檔案時發生錯誤"}finally{m.value=!1}},result:v,isLoading:C,error:I,createIndex:async()=>{var u;if(!s.value.trim()){alert("請輸入索引名稱");return}C.value=!0,I.value="",v.value=[];try{const o=await f.get("https://knowledge-base-backend.leechiuhui.workers.dev/vectorize/createVectorizeIndex/"+encodeURIComponent(s.value),{headers:{"Content-Type":"application/json"}});console.log(o),v.value=[{status:"成功",message:"索引建立完成"}]}catch(o){console.error(o);const i=(u=o.response)==null?void 0:u.data;I.value=(i==null?void 0:i.message)||"建立索引時發生錯誤"}finally{C.value=!1}},deleteIndexName:V,deleteResult:N,isDeleteLoading:z,deleteError:E,deleteIndex:async()=>{var u;if(!V.value.trim()){alert("請輸入索引名稱");return}z.value=!0,E.value="",N.value=[];try{const o=await f.get("https://knowledge-base-backend.leechiuhui.workers.dev/vectorize/deleteVectorizeIndex/"+encodeURIComponent(V.value),{headers:{"Content-Type":"application/json"}});console.log("deleteIndex後第一次response訊息："),console.log(o),N.value=[{status:"成功",message:"索引刪除完成"}]}catch(o){console.error(o);const i=(u=o.response)==null?void 0:u.data;E.value=(i==null?void 0:i.message)||"刪除索引時發生錯誤"}finally{z.value=!1}},startNumber:F,endNumber:D,batchVectorizeResult:T,isBatchVectorizeLoading:L,batchVectorizeError:G,vectorizeR2FileRange:async()=>{var p;if(!F.value||!D.value){alert("請輸入起始和結束編號");return}const u=parseInt(F.value),o=parseInt(D.value);if(u>o){alert("起始編號不能大於結束編號");return}L.value=!0,G.value="",T.value=[];try{const i=await f.get(`https://knowledge-base-backend.leechiuhui.workers.dev/setupVectorFromR2/${u}/${o}`,{headers:{"Content-Type":"application/json"}});console.log(i),T.value=[{status:"成功",message:`已完成第 ${u} 到第 ${o} 個檔案的向量化`}]}catch(i){console.error(i);const U=(p=i.response)==null?void 0:p.data;G.value=(U==null?void 0:U.message)||"批量向量化處理時發生錯誤"}finally{L.value=!1}}}}}),S={class:"workflow-container"},M={class:"workflow-section"},q={class:"workflow-steps"},H={class:"step-card"},J={class:"step-content"},O={class:"ui form"},Q={class:"field"},W={class:"ui action input"},X={class:"upload-result"},Y={key:0,class:"loading"},Z={key:1,class:"ui positive message"},x={class:"ui celled table"},_={key:2,class:"ui negative message"},ee={class:"description"},le={class:"ui segment"},se={class:"ui input"},te={class:"result"},oe={key:0,class:"loading"},ne={key:1,class:"ui positive message"},de={class:"ui celled table"},ae={key:2,class:"ui negative message"},ie={class:"description"},re={class:"ui segment"},ue={class:"ui input"},ve={class:"delete-result"},pe={key:0,class:"loading"},ge={key:1,class:"ui positive message"},ce={class:"ui celled table"},me={key:2,class:"ui negative message"},fe={class:"description"},ye={class:"ui segment"},be={class:"ui form"},he={class:"two fields"},ke={class:"field"},we={class:"field"},Re={class:"batch-vectorize-result"},Ce={key:0,class:"loading"},Ie={key:1,class:"ui positive message"},Ve={class:"ui celled table"},Ne={key:2,class:"ui negative message"},ze={class:"description"};function Ee(s,l,g,$,c,m){return d(),n("main",S,[l[42]||(l[42]=e("h1",{class:"workflow-title"},"創源工具知識庫RAG文件處理流程",-1)),e("div",M,[l[21]||(l[21]=e("div",{class:"workflow-header"},[e("i",{class:"file archive outline icon"}),e("h2",null,"文件處理與向量化流程")],-1)),e("div",q,[e("div",H,[l[18]||(l[18]=e("div",{class:"step-number"},"01",-1)),l[19]||(l[19]=e("h3",null,"本地端/Local端文件「doc xls pdf jpg oog png wav mp3」上傳至 Google Drive",-1)),e("div",J,[l[16]||(l[16]=e("i",{class:"google drive icon"},null,-1)),l[17]||(l[17]=e("div",{class:"description"},"從本地端/Local端上傳文件到 Google Drive「準備上傳區」",-1)),e("div",O,[e("div",Q,[l[12]||(l[12]=e("label",null,"選擇文件",-1)),e("div",W,[e("input",{type:"file",ref:"fileInput",onChange:l[0]||(l[0]=(...t)=>s.handleFileChange&&s.handleFileChange(...t)),accept:"doc, xls, pdf, jpg, oog, png, wav, mp3",style:{display:"inline-block"}},null,544),e("button",{class:"ui primary button",onClick:l[1]||(l[1]=(...t)=>s.uploadToGoogleDriveReady&&s.uploadToGoogleDriveReady(...t))},l[11]||(l[11]=[e("i",{class:"upload icon"},null,-1),y("上傳至準備區")]))])])]),e("div",X,[s.isUploadLoading?(d(),n("div",Y,"載入中，請稍候...")):s.uploadResult.length>0?(d(),n("div",Z,[l[14]||(l[14]=e("h3",null,"操作結果",-1)),e("table",x,[l[13]||(l[13]=e("thead",null,[e("tr",null,[e("th",null,"檔案名稱"),e("th",null,"狀態"),e("th",null,"訊息")])],-1)),e("tbody",null,[(d(!0),n(b,null,h(s.uploadResult,(t,v)=>(d(),n("tr",{key:v},[e("td",null,r(s.selectedFile.name),1),e("td",null,r(t.status),1),e("td",null,r(t.message),1)]))),128))])])])):s.uploadError?(d(),n("div",_,[l[15]||(l[15]=e("h3",null,"錯誤訊息",-1)),e("div",ee,r(s.uploadError),1)])):k("",!0)])])]),l[20]||(l[20]=A('<div class="step-card" data-v-3ed18d05><div class="step-number" data-v-3ed18d05>02</div><h3 data-v-3ed18d05>Cloudflare R2 存儲</h3><div class="step-content" data-v-3ed18d05><i class="cloud upload icon" data-v-3ed18d05></i><div class="description" data-v-3ed18d05>將文件傳輸至 Cloudflare R2 存儲</div><div class="tech-tag" data-v-3ed18d05>main2.ts</div><ul class="step-details" data-v-3ed18d05><li data-v-3ed18d05>將文件從 Google Drive「準備上傳區」傳輸至 Cloudflare R2 存儲</li><li data-v-3ed18d05>記錄到「Cloudflare D1」數據庫 欄位有：是否已經向量化並進Cloudflare索引庫、文件路徑、檔案名稱、檔案綱要、檔案備註、檔案大小、檔案類型、上傳時間</li><li data-v-3ed18d05>移動至 Google Drive「已上傳區」進行備份</li></ul></div></div><div class="step-card" data-v-3ed18d05><div class="step-number" data-v-3ed18d05>03</div><h3 data-v-3ed18d05>向量化處理</h3><div class="step-content" data-v-3ed18d05><i class="database icon" data-v-3ed18d05></i><div class="description" data-v-3ed18d05>將 R2 文件向量化並存入 Cloudflare 索引庫</div><div class="tech-tag" data-v-3ed18d05>setupVectorFromR2</div><ul class="step-details" data-v-3ed18d05><li data-v-3ed18d05>select from Cloudflare D1 數據庫 欄位「是否已經向量化並進Cloudflare索引庫」 等於 false的id選出來</li><li data-v-3ed18d05>將 選出的id 從 Cloudflare R2 存儲庫 提取後向量化存入 Cloudflare 索引庫</li><li data-v-3ed18d05>更新 Cloudflare D1 數據庫 將欄位「是否已經向量化並進Cloudflare索引庫」 等於 true</li></ul></div></div>',2))])]),l[43]||(l[43]=e("h1",{class:"ui header"},"創源工具-索引建立",-1)),e("div",le,[l[26]||(l[26]=e("h2",null,"步驟一：建立向量索引",-1)),l[27]||(l[27]=e("div",{class:"ui message info"},[e("div",{class:"description"},"此步驟將建立向量索引，用於後續的文件檢索")],-1)),e("div",se,[w(e("input",{type:"text",placeholder:"請輸入索引名稱..","onUpdate:modelValue":l[2]||(l[2]=t=>s.indexName=t),onKeyup:l[3]||(l[3]=j((...t)=>s.createIndex&&s.createIndex(...t),["enter"]))},null,544),[[R,s.indexName]]),e("button",{class:"ui primary button",onClick:l[4]||(l[4]=(...t)=>s.createIndex&&s.createIndex(...t))},l[22]||(l[22]=[e("i",{class:"plus icon"},null,-1),y("建立索引")]))]),e("div",te,[s.isLoading?(d(),n("div",oe,"載入中，請稍候...")):s.result.length>0?(d(),n("div",ne,[l[24]||(l[24]=e("h3",null,"操作結果",-1)),e("table",de,[l[23]||(l[23]=e("thead",null,[e("tr",null,[e("th",null,"索引名稱"),e("th",null,"狀態"),e("th",null,"訊息")])],-1)),e("tbody",null,[(d(!0),n(b,null,h(s.result,(t,v)=>(d(),n("tr",{key:v},[e("td",null,r(s.indexName),1),e("td",null,r(t.status),1),e("td",null,r(t.message),1)]))),128))])])])):s.error?(d(),n("div",ae,[l[25]||(l[25]=e("h3",null,"錯誤訊息",-1)),e("div",ie,r(s.error),1)])):k("",!0)])]),e("div",re,[l[32]||(l[32]=e("h2",null,"步驟二：刪除向量索引",-1)),l[33]||(l[33]=e("div",{class:"ui message warning"},[e("div",{class:"description"},"此步驟將刪除向量索引，請謹慎操作")],-1)),e("div",ue,[w(e("input",{type:"text",placeholder:"請輸入要刪除的索引名稱..","onUpdate:modelValue":l[5]||(l[5]=t=>s.deleteIndexName=t),onKeyup:l[6]||(l[6]=j((...t)=>s.deleteIndex&&s.deleteIndex(...t),["enter"]))},null,544),[[R,s.deleteIndexName]]),e("button",{class:"ui negative button",onClick:l[7]||(l[7]=(...t)=>s.deleteIndex&&s.deleteIndex(...t))},l[28]||(l[28]=[e("i",{class:"trash icon"},null,-1),y("刪除索引")]))]),e("div",ve,[s.isDeleteLoading?(d(),n("div",pe,"載入中，請稍候...")):s.deleteResult.length>0?(d(),n("div",ge,[l[30]||(l[30]=e("h3",null,"操作結果",-1)),e("table",ce,[l[29]||(l[29]=e("thead",null,[e("tr",null,[e("th",null,"索引名稱"),e("th",null,"狀態"),e("th",null,"訊息")])],-1)),e("tbody",null,[(d(!0),n(b,null,h(s.deleteResult,(t,v)=>(d(),n("tr",{key:v},[e("td",null,r(s.deleteIndexName),1),e("td",null,r(t.status),1),e("td",null,r(t.message),1)]))),128))])])])):s.deleteError?(d(),n("div",me,[l[31]||(l[31]=e("h3",null,"錯誤訊息",-1)),e("div",fe,r(s.deleteError),1)])):k("",!0)])]),e("div",ye,[l[40]||(l[40]=e("h2",null,"步驟四：批量 R2 文件向量化",-1)),l[41]||(l[41]=e("div",{class:"ui message info"},[e("div",{class:"description"},"此步驟將對指定範圍內的 R2 文件進行批量向量化處理")],-1)),e("div",be,[e("div",he,[e("div",ke,[l[34]||(l[34]=e("label",null,"起始檔案編號",-1)),w(e("input",{type:"number",placeholder:"請輸入起始編號..","onUpdate:modelValue":l[8]||(l[8]=t=>s.startNumber=t),min:"1"},null,512),[[R,s.startNumber]])]),e("div",we,[l[35]||(l[35]=e("label",null,"結束檔案編號",-1)),w(e("input",{type:"number",placeholder:"請輸入結束編號..","onUpdate:modelValue":l[9]||(l[9]=t=>s.endNumber=t),min:"1"},null,512),[[R,s.endNumber]])])]),e("button",{class:"ui teal button",onClick:l[10]||(l[10]=(...t)=>s.vectorizeR2FileRange&&s.vectorizeR2FileRange(...t))},l[36]||(l[36]=[e("i",{class:"files icon"},null,-1),y("批量向量化")]))]),e("div",Re,[s.isBatchVectorizeLoading?(d(),n("div",Ce,"載入中，請稍候...")):s.batchVectorizeResult.length>0?(d(),n("div",Ie,[l[38]||(l[38]=e("h3",null,"操作結果",-1)),e("table",Ve,[l[37]||(l[37]=e("thead",null,[e("tr",null,[e("th",null,"處理範圍"),e("th",null,"狀態"),e("th",null,"訊息")])],-1)),e("tbody",null,[(d(!0),n(b,null,h(s.batchVectorizeResult,(t,v)=>(d(),n("tr",{key:v},[e("td",null,r(s.startNumber)+" - "+r(s.endNumber),1),e("td",null,r(t.status),1),e("td",null,r(t.message),1)]))),128))])])])):s.batchVectorizeError?(d(),n("div",Ne,[l[39]||(l[39]=e("h3",null,"錯誤訊息",-1)),e("div",ze,r(s.batchVectorizeError),1)])):k("",!0)])])])}const $e=K(P,[["render",Ee],["__scopeId","data-v-3ed18d05"]]);export{$e as default};