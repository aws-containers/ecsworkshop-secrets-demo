import React, { useState, useEffect, Fragment } from "react";

function ParamDemo() {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        getParamInfo();
    }, []);

    const url = "/parameter-store-demo";

    const getParamInfo = async () => {
        const response = await fetch(url);
        const jsonData = await response.json();
        setUserData(jsonData);
    };

    return (
        <Fragment>

            <div class="container">
                <div class="row h-100">
                    <div id="imageTarget" class="col-sm-12 my-auto">
                        {userData.value
                            ? <div><div className="divider py-1 bg-dark my-4"></div><h3>Parameter Store Test</h3> <img src={userData.value} /></div>
                            : <div></div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default ParamDemo;