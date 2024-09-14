import React, { useState, useEffect } from "react";

import '../App.css'

const AgentResponseGenerator = (props) => {
   const [agentContent, setAgentContent] = useState(null);

   useEffect(() => {
      if (props.data) {
         const reversedData = [...props.data].reverse();
         const lastAgentMessage = reversedData.find(message => message.role === "agent");
         if (lastAgentMessage) {
            const parsedContent = JSON.parse(lastAgentMessage.content);
            setAgentContent(parsedContent.lp_elements);
         }
      }
   }, [props.data.length]);

   return (
    <div style={{borderTop: 'solid 1px #bebebe', paddingTop:'50px'}}>
      {agentContent}
    </div>
   );
};

export default AgentResponseGenerator;
