import React, { useState } from "react";
import { Pagination } from "antd";

export default function Mypagination({ props, setOnLoading }) {
  const { page,  hasNextPage, hasPrevPage, totalDocs } = props;
  const [current, setCurrent] = useState(page ? page : 1);
  const onChange = (page, pageSize) => {
    if (hasNextPage || hasPrevPage) {
      setCurrent(page);
    }
    setOnLoading({
      page: current,
      limit: pageSize
    });
  };

  return (
    <Pagination
      current={current}
      total={totalDocs}
      onChange={onChange}
      pageSizeOptions={["10", "20", "30"]}
      showSizeChanger
    />
  );
}
