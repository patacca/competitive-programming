#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

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
		int n;
};

istream& operator>>(istream& s, Test& t) {
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

int askMin(int i, int j)
{
	cout << "?";
}

void solve()
{
	int n, N;
	cin >> n;
	N = n;
	
	if (n == 3) {
		vector<int> p(3);
		int m1 = askMin(0, 1);
		int M1 = askMax(0, 1);
		int m2 = askMin(1, 2);
		int M2 = askMax(1, 2);
		if (m1 == m2 || m1 == M2) {
			p[1] = m1;
			p[0] = M1;
			if (m1 == m2)
				p[2] = M2;
			else
				p[2] = m2;
		} else {
			p[1] = M1;
			p[0] = m1;
			if (M1 == m2)
				p[2] = M2;
			else
				p[2] = m2;
		}
		
		cout << "!" << p[0] << " " << p[1] << " " << p[2] << endl;
		cout.flush();
		return;
	}
	
	if (n%2 != 0)
		--n;
	
	vector<pair<int,int>> c(n, {0,0});
	vector<int> p(n);
	vector<bool> used(n+1, false);
	
	for (int k=0; k < n; k+=2) {
		int m = askMin(k, k+1);
		int M = askMax(k, k+1);
		c[k] = {m,M};
		c[k+1] = {m,M};
		used[m] = used[M] = true;
	}
	
	for (int k=0; k < n; k+=4) {
		int m = askMin(k+1, k+2);
		int M = askMax(k+1, k+2);
		if (M == c[k+1].first || M == c[k+1].second)
			swap(m, M);
		
		int tmp = (m == c[k+1].first ? c[k+1].second : c[k+1].first);
		p[k+1] = m;
		p[k] = tmp;
		tmp = (M == c[k+2].first ? c[k+2].second : c[k+2].first);
		p[k+2] = M;
		p[k+3] = tmp;
	}
	
	if (N%2 == 1)
		for (int k=1; k < n+1; ++k)
			if (!used[k])
				p[N-1] = k;
	
	cout << "!";
	for (auto& x : p)
		cout << x << " ";
	cout << endl;
	cout.flush();
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	//~ readInput();
	cin >> T;
	
	// Solve each test
	while (T--) {
		solve();
	}
	
	return 0;
}
