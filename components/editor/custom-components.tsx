export const Leaf = (props: any) => {
  return (
    <span {...props.attributes} data-selected={props.leaf.selected}>
      {props.children}
    </span>
  );
};

export const DefaultElement = (props: any) => {
  return <span {...props.attributes}>{props.children}</span>;
};
