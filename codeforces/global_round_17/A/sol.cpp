#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

#define BOOST_FUNCTIONAL_HASH_ROTL32(x, r) (x << r) | (x >> (32 - r))

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}

struct custom_hash {
	static uint64_t splitmix64(uint64_t x) {
		// http://xorshift.di.unimi.it/splitmix64.c
		x += 0x9e3779b97f4a7c15;
		x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
		x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
		return x ^ (x >> 31);
	}

	static int splitmix32(int x) {
		uint64_t z = x;
		return (splitmix64(z) & 0xffffffff);
	}

	uint64_t operator()(uint64_t x) const {
		static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
		return splitmix64(x + FIXED_RANDOM);
	}

	int operator()(int x) const {
		static const int FIXED_RANDOM = (chrono::steady_clock::now().time_since_epoch().count() & 0xffffffff);
		return splitmix32(x + FIXED_RANDOM);
	}
};

inline void hash_combine(uint32_t &h1, uint32_t k1)
{
	const uint32_t c1 = 0xcc9e2d51;
	const uint32_t c2 = 0x1b873593;
	
	k1 *= c1;
	k1 = BOOST_FUNCTIONAL_HASH_ROTL32(k1,15);
	k1 *= c2;
	
	h1 ^= k1;
	h1 = BOOST_FUNCTIONAL_HASH_ROTL32(h1,13);
	h1 = h1*5+0xe6546b64;
}

inline void hash_combine(uint64_t &h, uint64_t k)
{
	const uint64_t m = 0xc6a4a7935bd1e995ULL;
	const int r = 47;
	
	k *= m;
	k ^= k >> r;
	k *= m;
	
	h ^= k;
	h *= m;
	
	// Completely arbitrary number, to prevent 0's
	// from hashing to 0.
	h += 0xe6546b64;
}

template <typename T>
inline T custom_ceil(T a, T b)
{
	return 1 + ((a - 1) / b);
}

template <typename T>
inline double log_b(T base, T x)
{
	return log(x)/log(base);
}

inline long double log_b(long double base, long double x)
{
	return log(x)/log(base);
}

template <typename T1, typename T2>
inline int perfect_log(T1 base, T2 x)
{
	int e = static_cast<int>(log_b(base, x));
	int best = {e};
	for (int k=-1; k < 2; ++k)
		if (pow(base, e+k) <= x)
			best = e+k;
	return best;
}

/* Fast inverse of a modulo p (p must be prime) */
template <typename T>
long long fast_inv(T a, T p) {
	long long res = 1;
	long long p2 {p-2};
	while (p2) {
		if (p2 % 2 == 0) {
			a = a * 1ll * a % p;
			p2 /= 2;
		} else {
			res = res * 1ll * a % p;
			p2--;
		}
	}
	return res;
}

/* Extended Euclidean Algorithm */
template <typename T>
T extended_euclidean(T a, T b, T& x, T& y) {
	x = (T)1;
	y = (T)0;
	T x1 = (T)0;
	T y1 = (T)1;
	T a1 = a;
	T b1 = b;
	while (b1) {
		T q = a1 / b1;
		tie(x, x1) = make_tuple(x1, x - q * x1);
		tie(y, y1) = make_tuple(y1, y - q * y1);
		tie(a1, b1) = make_tuple(b1, a1 - q * b1);
	}
	return a1;
}

void segmented_sieve_optimized(int n, vector<int>& primes) {
	const int S = 30'000;
	
	int nsqrt = round(sqrt(n));
	
	vector<char> is_prime(nsqrt + 1, true);
	vector<int> lowPrimes, start_indices;
	for (int i = 3; i <= nsqrt; i += 2) {
		if (is_prime[i]) {
			lowPrimes.push_back(i);
			start_indices.push_back((i * i - 1) / 2);
			for (int j = i * i; j <= nsqrt; j += 2 * i)
				is_prime[j] = false;
		}
	}
	
	primes.push_back(2);
	vector<char> block(S);
	int high = (n - 1) / 2;
	for (int low = 0; low <= high; low += S) {
		fill(block.begin(), block.end(), true);
		for (auto i = 0u; i < lowPrimes.size(); i++) {
			int p = lowPrimes[i];
			int idx = start_indices[i];
			for (; idx < S; idx += p)
				block[idx] = false;
			start_indices[i] = idx - S;
		}
		if (low == 0)
			block[0] = false;
		for (int i = 0; i < S && low + i <= high; i++) {
			if (block[i])
				primes.push_back((low + i) * 2 + 1);
		}
	};
}




// USER CODE

struct Test {
	public:
		int n, m;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n >> t.m;
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

void solve(Test& t)
{
	if (t.n == t.m && t.n == 1)
		cout << "0\n";
	else if (t.n == 1 || t.m == 1)
		cout << "1\n";
	else
		cout << "2\n";
}

void solveStep()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		solve(t);
	}
}

void solveSingleStep()
{
	Test t;
	cin >> t;
	solve(t);
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	solveStep();
	//~ solveSingleStep();
	
	// Solve each test
	//~ readInput();
	//~ for (auto& t : tests) {
		//~ solve(t);
	//~ }
	
	return 0;
}
