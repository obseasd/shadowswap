export const NETWORKS = {
  sepolia: {
    name: "Starknet Sepolia",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/demo",
    explorerUrl: "https://sepolia.starkscan.co",
    tokens: {
      ETH: {
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        erc20: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        tongo: "0x2cf0dc1d9e8c7731353dd15e6f2f22140120ef2d27116b982fa4fed87f6fef5",
        rate: 3000000000000n,
      },
      USDC: {
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        erc20: "0x53b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080",
        tongo: "0x2caae365e67921979a4e5c16dd70eaa5776cfc6a9592bcb903d91933aaf2552",
        rate: 10000n,
      },
      STRK: {
        symbol: "STRK",
        name: "Starknet Token",
        decimals: 18,
        erc20: "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        tongo: "0x408163bfcfc2d76f34b444cb55e09dace5905cf84c0884e4637c2c0f06ab6ed",
        rate: 50000000000000000n,
      },
    },
  },
} as const;

export type TokenSymbol = "ETH" | "USDC" | "STRK";
export type TokenConfig = (typeof NETWORKS.sepolia.tokens)[TokenSymbol];

export const TONGO_CLASS_HASH = "0x00582609087e5aeb75dc25284cf954e2cee6974568d1b5636052a9d36eec672a";

export const getNetwork = () => NETWORKS.sepolia;
export const getToken = (symbol: TokenSymbol) => NETWORKS.sepolia.tokens[symbol];
export const getExplorerTxUrl = (hash: string) => `${NETWORKS.sepolia.explorerUrl}/tx/${hash}`;
export const getExplorerContractUrl = (addr: string) => `${NETWORKS.sepolia.explorerUrl}/contract/${addr}`;
