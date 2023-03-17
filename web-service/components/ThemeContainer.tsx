interface IProps {
    children: React.ReactNode
}

export default function ThemeContainer(props: IProps) {
  return (
    <div>{props.children}</div>
  )
}