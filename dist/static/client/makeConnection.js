async function connector(n,t){return await(await fetch(location.href,{method:"POST",body:JSON.stringify({connectorCall:{name:n,values:t}}),headers:{"Content-Type":"application/json"}})).json()}
