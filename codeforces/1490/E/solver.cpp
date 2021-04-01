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




// USER CODE

struct Test {
	public:
		int n;
		vector<long long> a;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	
	t.a.resize(t.n);
	for (int k=0; k < t.n; ++k)
		s >> t.a[k];
	
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
	vector<long long> partial;
	vector<pair<long long,int>> cpy;
	
	for (int k=0; k < t.n; ++k) {
		cpy.push_back({t.a[k], k});
	}
	sort(cpy.begin(), cpy.end());
	
	long long last{0};
	for (auto& x : cpy) {
		partial.push_back(last + x.first);
		last = partial.back();
	}
	
	vector<bool> sol(t.n, true);
	int ss{t.n};
	for (int k=t.n-2; k >= 0; --k) {
		if (partial[k] < cpy[k+1].first) {
			ss = t.n - k - 1;
			for (int j = 0; j <= k; ++j)
				sol[j] = false;
			break;
		}
	}
	
	vector<int> answer;
	cout << ss << endl;
	for (int k=0; k < t.n; ++k)
		if (sol[k])
			answer.push_back(cpy[k].second+1);
	
	sort(answer.begin(), answer.end());
	for (auto& x : answer)
		cout << x << " ";
	cout << endl;
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		solve(t);
	}
	
	return 0;
}
