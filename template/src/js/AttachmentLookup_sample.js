(() => {
  "use strict";
  const client = new KintoneRestAPIClient();
  const lookupField = 'Lookup';
  const KeyField = 'RecordID';
  const attachmentsField = 'Attachment';
  const targetTable = 'ProductsServices';
  const originAttachmentsField = 'Attachment';

  kintone.events.on([
    'app.record.create.submit.success',
    'app.record.edit.submit.success',
  ], async (ev) => {
    const subtable = ev.record[targetTable].value;
    const appId = kintone.app.getLookupTargetAppId(lookupField);
    const row = []; // 加工データ挿入用配列

    for await (let elem of subtable){ 
      const key = elem.value[KeyField].value;
      if(!key) {
        delete elem.value[lookupField];
        row.push(elem);
        continue;
      }
      const originRecord = await client.record.getRecord({app: appId, id: key});
      // ルックアップ元から添付ファイルをダウンロード
      const files = await kintone.Promise.all(originRecord.record[originAttachmentsField].value.map(async (originFileInfomation) => {
        const fileData = await client.file.downloadFile({fileKey: originFileInfomation.fileKey})
          return {
            file: {
              name: originFileInfomation.name,
              data: new Blob([fileData], {type: originFileInfomation.contentType})
            }
          };
        }));

      // ルックアップ先へ添付ファイル
      const copyFileInfomations = await kintone.Promise.all(files.map(async (file) => {
        return client.file.uploadFile(file);
      }));

      elem.value[attachmentsField].value = copyFileInfomations;
      delete elem.value[lookupField];
      row.push(elem);
    };

    await client.record.updateRecord({
      app: ev.appId,
      id: ev.recordId,
      record: {
        [targetTable]:{
          value: row 
        }
      }
    })

    return ev;
  });
})();