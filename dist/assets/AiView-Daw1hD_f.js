import{d as f,r as u,a as w,c as t,b as e,e as r,w as k,v as h,f as b,F as p,g as y,n as M,o,t as a,_ as c}from"./index-Cy_DIYE6.js";const C=f({name:"AiView",setup(){const n=u(""),s=u([]),d=u(!1);return{message:n,result:s,isLoading:d,sendMessage:()=>{if(!n.value.trim()){alert("請輸入問題");return}d.value=!0,s.value=[],console.log(n.value),n.value.endsWith("？")||(n.value+="？"),w.get("https://knowledge-base-backend.leechiuhui.workers.dev/generateBeddings/"+encodeURIComponent(n.value),{headers:{"Content-Type":"application/json"}}).then(l=>{console.log(l),s.value=l.data,d.value=!1}).catch(l=>{console.error(l),d.value=!1})},formatMetadata:l=>JSON.stringify(l,null,2),downloadFile:l=>{console.log(l);const i="https://knowledge-base-backend.leechiuhui.workers.dev/api/download/"+l.filename;window.open(i,"_blank")}}}}),F={class:"ui segment"},V={class:"ui input"},$={class:"result"},A={key:0},B={class:"ui celled table"},D=["onClick"],I={key:2};function L(n,s,d,g,m,v){return o(),t("main",null,[s[9]||(s[9]=e("h1",{class:"ui header"},"AI機器人-創源工具RAG",-1)),e("div",F,[s[7]||(s[7]=r("輸入創源工具問題和R2資料庫文件做向量比對，取最高分的2個文件內容回傳。")),s[8]||(s[8]=e("p",null,"請輸入問題",-1)),e("div",V,[k(e("input",{autofocus:"",type:"text",placeholder:"請輸入問題..","onUpdate:modelValue":s[0]||(s[0]=l=>n.message=l),onKeyup:s[1]||(s[1]=b((...l)=>n.sendMessage&&n.sendMessage(...l),["enter"]))},null,544),[[h,n.message]]),e("button",{class:"ui button",onClick:s[2]||(s[2]=(...l)=>n.sendMessage&&n.sendMessage(...l))},"送出")]),e("div",$,[n.isLoading?(o(),t("p",A,"載入中，請稍候...")):n.result.length>0?(o(),t(p,{key:1},[s[5]||(s[5]=e("h1",null,"查詢結果列表如下",-1)),e("table",B,[s[4]||(s[4]=e("thead",null,[e("tr",null,[e("th",null,"序號"),e("th",null,"問題"),e("th",null,"答案"),e("th",null,"匹配ID"),e("th",null,"相似度分數"),e("th",null,"MetaData"),e("th",null,"動作")])],-1)),e("tbody",null,[(o(!0),t(p,null,y(n.result,(l,i)=>(o(),t("tr",{key:i},[e("td",null,a(i+1),1),e("td",null,a(n.message),1),e("td",null,a(l.aiResponse),1),e("td",null,a(l.id),1),e("td",null,a(l.score.toFixed(2)),1),e("td",null,[e("pre",null,a(n.formatMetadata(l.metadata)),1)]),e("td",null,[e("button",{class:"ui primary button",onClick:R=>n.downloadFile(l.metadata),style:{"min-width":"10em"}},s[3]||(s[3]=[e("i",{class:"download icon"},null,-1),r("下載檔案")]),8,D)])]))),128))])])],64)):(o(),t("p",I,"未找到相關結果"))]),e("div",{class:M(["ui dimmer",{active:n.isLoading}])},s[6]||(s[6]=[e("div",{class:"ui loader"},null,-1)]),2)])])}const T=c(C,[["render",L],["__scopeId","data-v-e6e59e1d"]]);export{T as default};