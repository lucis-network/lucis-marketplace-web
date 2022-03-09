import {
  Button,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import BoxIcon from "@static/icons/item-box.svg"
import VerifiedIcon from "@static/icons/verified.svg"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "react-feather"
import { AppPagination } from "src/components/AppPagination"
import { AppSelect } from "src/components/AppSelect"
import { AppTable } from "src/components/AppTable"
import { ListingBar } from "src/components/Home/ListingBar"
import { NftItem } from "src/components/NftItem"

const CollectionDetails = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const router = useRouter()
  const [data, setData] = useState<any>()

  const [items, setItems] = useState<any[]>()
  const [itemTotal, setItemTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [itemType, setItemType] = useState(false)
  const [itemSort, setItemSort] = useState("asc")
  const [pageSize, setPageSize] = useState(10)

  const [total, setTotal] = useState(2000)

  const [itemOffset, setItemOffset] = useState(0)
  const [itemPageSize, setItemPageSize] = useState(20)

  const fetchData = async () => {
    const id = await router.query.id
    if (id) {
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_API_TEST + "/collections/" + id
      )
      setData(data)
    }
  }

  const fetchItems = async () => {
    const id = await router.query.id
    if (id) {
      const { data, headers } = await axios.get(
        `process.env.NEXT_PUBLIC_API_TEST/nft/?collection.id=${id}&&_page=${Math.ceil(
          itemOffset / itemPageSize
        )}&&_limit=${itemPageSize}&&isAuction=${itemType}&&_sort=price&&_order=${itemSort}`
      )
      setItems(data)
      setItemTotal(+headers["x-total-count"])
    }
  }

  useEffect(() => {
    fetchData()
    fetchItems()
  }, [router.query.id])

  useEffect(() => {
    fetchItems()
  }, [router.query.id, itemOffset, itemPageSize, itemType, itemSort])

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const providerSocials = [
    {
      key: "facebook",
      image: "/common/footer/nav2.png",
    },
    {
      key: "telegram",
      image: "/common/footer/nav4.png",
    },
    {
      key: "twitter",
      image: "/common/footer/nav5.png",
    },
    {
      key: "discord",
      image: "/common/footer/nav6.png",
    },
  ]

  const stats = [
    {
      key: "Traded",
      value: data?.stats?.traded + "+",
    },
    {
      key: "Player",
      value: data?.stats?.player + "+",
    },
    {
      key: "Listed",
      value: data?.stats?.listed + "+",
    },
    {
      key: "Volume",
      value: data?.stats?.volume + "+",
    },
    {
      key: "Floor Price",
      value: data?.stats?.floorPrice + "+",
    },
    {
      key: "Max Price",
      value: data?.stats?.maxPrice,
    },
  ]

  const _renderItemList = () => (
    <div className="collection-item-list">
      <div className="filter-row">
        <div className="total">137335 items listed</div>
        <div className="filter">
          <AppSelect
            value={itemType}
            placeholder="Type"
            isSearchable={false}
            onChange={({ value }) => setItemType(value as boolean)}
            options={[
              {
                label: "Fix price",
                value: false,
              },
              {
                label: "Auc",
                value: true,
              },
            ]}
          />
          <AppSelect
            placeholder="Price: Min to Max"
            isSearchable={false}
            value={itemSort}
            onChange={({ value }) => setItemSort(value)}
            options={[
              {
                label: "Price: Min to Max",
                value: "asc",
              },
              {
                label: "Price: Max to Min",
                value: "desc",
              },
            ]}
          />
        </div>
      </div>
      <div className="item-list">
        {items?.map((item) => (
          <NftItem
            key={item.id}
            name={item.name}
            image={item.image}
            collection={item.collection}
            endTime={item.endTime}
            price={item.price}
            isAuction={item.isAuction}
          />
        ))}
      </div>
      <AppPagination
        total={itemTotal}
        offset={itemOffset}
        pageSize={itemPageSize}
        onChangeOffset={(value) => setItemOffset(value)}
        onChangPageSize={(value) => setItemPageSize(value)}
      />
    </div>
  )

  const _renderActivities = () => (
    <div className="collection-activities">
      <div className="filter-row">
        <AppSelect
          placeholder="All"
          isSearchable={false}
          options={[
            {
              label: "All",
              value: "1",
            },
            {
              label: "Listing",
              value: "2",
            },
            {
              label: "Sale",
              value: "3",
            },
            {
              label: "Auction",
              value: "4",
            },
            {
              label: "Offer",
              value: "5",
            },
          ]}
        />
      </div>
      <AppTable className="data-table" data={tableData} columns={columns} />
      <AppPagination
        total={total}
        offset={offset}
        pageSize={pageSize}
        onChangeOffset={(value) => setOffset(value)}
        onChangPageSize={(value) => setPageSize(value)}
      />
    </div>
  )

  return (
    <div className="collection-details-page">
      <div className="provider-name">
        {data?.name}
        <VerifiedIcon />
      </div>
      <div className="provider-socials">
        {providerSocials.map((item) => (
          <img key={item.key} src={item.image} />
        ))}
      </div>
      <div className="collection-stats">
        {stats?.map((stat) => (
          <div key={stat.key} className="stat">
            <p className="stat-key">{stat.key}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className={`collection-description ${isExpanded ? "expanded" : ""}`}>
        {data?.description}
      </div>
      <Button className="expand-button" onClick={handleExpand}>
        <Icon as={isExpanded ? ChevronUp : ChevronDown} />
      </Button>
      <img className="collection-banner" src={data?.banner} />
      <ListingBar />
      <div className="collection-content">
        <Tabs>
          <TabList>
            <Tab className="tab-item">ITEMS</Tab>
            <Tab className="tab-item">ACTIVITIES</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{_renderItemList()}</TabPanel>
            <TabPanel>{_renderActivities()}</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  )
}

export default CollectionDetails

const itemList = [
  {
    id: "1",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction1.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "2",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction2.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "3",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction3.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "4",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction4.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "5",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction5.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "6",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction1.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "7",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction2.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "8",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction3.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "9",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction4.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "10",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction5.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "11",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction1.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "12",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction2.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "13",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction3.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "14",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction4.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "15",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction5.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "16",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction1.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "17",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction2.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "18",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction3.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
  {
    id: "19",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction4.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: true,
  },
  {
    id: "20",
    name: "CUONG DOLLA NFT",
    image: "/home/auctions/auction5.png",
    collection: { id: "1", name: "Animverse" },
    endTime: "2022-03-15T00:00:00",
    price: 0.99,
    isAuction: false,
  },
]

const columns = [
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Item",
    dataIndex: "item",
    render: ({ item }) => (
      <span className="item-column">
        <Button>
          <BoxIcon />
        </Button>
        {item}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "From",
    dataIndex: "from",
  },
  {
    title: "To",
    dataIndex: "to",
    render: ({ to }) => `${to?.slice(0, 5)}...${to?.slice(-4)}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    render: ({ date, to }) => (
      <a
        className="date-column"
        href={process.env.NEXT_PUBLIC_BSC_SCAN_TX + to}
        rel="noreferrer"
        target="_blank"
      >
        {date} <Icon as={ExternalLink} />
      </a>
    ),
  },
]

const tableData = [
  {
    type: "Sale",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Listing",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Offer",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Auction",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Sale",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Auction",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Offer",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Listing",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Sale",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
  {
    type: "Sale",
    item: "Animverse",
    price: "26.94 BNB",
    from: "Dong Van Cuong",
    to: "0x6fc283166afa80509c9434291c49bcdc4ede4d53d7c049a2306f43ed7121224d",
    date: "1 days ago",
  },
]
