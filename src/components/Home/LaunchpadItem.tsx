import moment from "moment"
import BoxsIcon from "../../../public/home/boxs.svg"
import ItemsIcon from "../../../public/home/items.svg"

interface IProps {
  name?: string
  image?: string
  isOnGoing?: boolean
  boxs?: number
  items?: number
  startTime?: string
}

export const LaunchpadItem = (props: IProps) => {
  const { name, image, isOnGoing, boxs, items, startTime } = props

  return (
    <div className="launchpad-item">
      <div className="launchpad-image">
        <img src={image} />
      </div>
      <span className={isOnGoing ? "on-going" : "up-coming"}>
        {isOnGoing ? "Ongoing" : "Upcoming"}
      </span>
      <span className="launchpad-name">{name}</span>
      {isOnGoing ? (
        <div className="launchpad-stats">
          <div className="stat">
            <BoxsIcon />
            <span>{boxs}</span> BOXES
          </div>
          <div className="stat">
            <ItemsIcon />
            <span>{items}</span> ITEMS
          </div>
        </div>
      ) : (
        <div className="start-in">
          <span>START IN</span>
          <span>{moment(startTime).format("HH:mm:ss")}</span>
        </div>
      )}
    </div>
  )
}