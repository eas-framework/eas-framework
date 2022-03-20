async function connector(name, values) {
    const data = await fetch(location.href, {
        method: 'POST',
        body: JSON.stringify({
            connectorCall: {
                name,
                values
            }
        }),
        headers:{
            "Content-Type":"application/json"
        }
    });

    return await data.json();
}