/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

const LiveSearch = ({
  onChangeKeyword,
  keywordSearch,
}: {
  onChangeKeyword: (keyword: string) => void;
  keywordSearch?: string;
}) => {
  const [keyword, setKeyword] = useState<string>('');
  const onTyping = (event: any) => {
    setKeyword(event.target.value);
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onChangeKeyword(keyword);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [keyword]);
  return (
    <input
      value={keyword}
      type="search"
      onChange={onTyping}
      className="form-control form-control-sm ms-1"
      placeholder={keywordSearch || 'Please Search'}
    />
  );
};

export default LiveSearch;
