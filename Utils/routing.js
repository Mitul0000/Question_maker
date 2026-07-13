const {RAG_TOKEN_THRESHOLD} = require("../Config/constants").constants;
const { countTokens } = require("./tokenCounter");

const decideRoute = (text) =>{
  const tokenCount = countTokens(text);
  if(tokenCount > RAG_TOKEN_THRESHOLD){
    return "rag";
  }
  return "Direct";
}