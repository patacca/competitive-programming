#include <string>
#include <ios>
#include <iostream>
#include <vector>
#include <unordered_set>
#include <algorithm>

using namespace std;

bool constexpr DEBUG {false};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}



// USER CODE

struct Test {
	public:
		int n;
		vector<long long int> a;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	for (int k=0; k < 2*t.n; ++k) {
		long long d;
		s >> d;
		t.a.push_back(d);
	}
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	for (auto& k : t.a)
		s << k << ' ';
	
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

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		sort(t.a.begin(), t.a.end(), [&] (auto a, auto b) { return a>b; });
		//~ debug(t);
		int left {t.n};
		long long int partialSum {0}, lastVal;
		bool found {true}, skip{false};
		unordered_set<long long int> model;
		for (auto& d : t.a) {
			if (skip) {
				if (lastVal != d) {
					found = false;
					break;
				}
				skip = false;
				continue;
			}
			if (d % 2 != 0) {
				found = false;
				break;
			}
			long long int tot {d/2};
			tot -= partialSum;
			if (tot % left != 0) {
				found = false;
				break;
			}
			//~ debug(tot);
			tot /= left;
			if (tot <= 0 || tot > 1e12 || model.find(tot) != model.end()) {
				//~ debug(*model.find(tot));
				found = false;
				break;
			}
			//~ debug(tot);
			
			// Solution correct
			model.insert(tot);
			--left;
			partialSum += tot;
			skip = true;
			lastVal = d;
		}
		if (found)
			cout << "YES\n";
		else
			cout << "NO\n";
	}
	
	return 0;
}
