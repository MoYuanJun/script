import addData from './add.json';
import getData from './get.json';
import listData from './list.json';
import deleteData from './delete.json';
import updateData from './update.json';
import typeListData from './typeList.json';

const config = {
  "api_get": { url: './get.json', data: getData },
  "api_add": { url: './add.json', data: addData },
  "api_list": { url: './list.json', data: listData },
  "api_delete": { url: './delete.json', data: deleteData },
  "api_update": { url: './update.json', data: updateData },
  "api_update": { url: './update.json', data: updateData },
  "api_typeList": { url: './typeList.json', data: typeListData },
};

const asyncManage = {};

_.forIn(config, (value, key) => {
  asyncManage[key] = async function (payload) {
    console.log({ url: value.url, payload });
    return value.data;
  }
})

export default asyncManage;
