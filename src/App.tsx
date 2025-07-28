import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Slider } from "./components/ui/slider";
import {
  MapPin,
  User,
  Phone,
  AlertCircle,
  Loader2,
  X,
  Clock,
  CheckCircle,
  Navigation,
  Heart,
  MessageSquare,
  Stethoscope,
  Users,
  Car,
  PersonStanding,
  Map,
  Bell,
  Route,
  Share2,
} from "lucide-react";

type UserType = "help-seeker" | "help-provider" | "general-user";
type AppState =
  | "user-selection"
  | "initial"
  | "confirmation"
  | "waiting"
  | "help-on-way"
  | "provider-dashboard"
  | "provider-accepted"
  | "general-map";
type EmergencyType =
  | "unresponsive"
  | "choking"
  | "heart-attack"
  | "breathing"
  | "other";

interface AcceptedHelper {
  id: string;
  name: string;
  distance: string;
  eta: string;
  rating: number;
}

interface EmergencyRequest {
  id: string;
  location: string;
  distance: string;
  description: string;
  type: EmergencyType;
  acceptedCount: number;
  acceptedETAs: string[];
  hasMedicalProfile: boolean;
  canSMS: boolean;
  timestamp: string;
  status: "unaccepted" | "accepted";
  coordinates: { lat: number; lng: number };
}

export default function App() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [appState, setAppState] = useState<AppState>("user-selection");
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyType, setEmergencyType] =
    useState<EmergencyType>("unresponsive");
  const [customDescription, setCustomDescription] = useState("");
  const [shareMedicalProfile, setShareMedicalProfile] = useState(true);
  const [acceptedHelpers, setAcceptedHelpers] = useState<AcceptedHelper[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [providerETA, setProviderETA] = useState([5]);
  const [showNotification, setShowNotification] = useState(false);

  // Mock emergency requests data
  const [emergencyRequests, setEmergencyRequests] = useState<
    EmergencyRequest[]
  >([
    {
      id: "1",
      location: "0.3 miles away • Main St & Oak Ave",
      distance: "0.3 miles",
      description: "Unresponsive male, mid-40s",
      type: "unresponsive",
      acceptedCount: 0,
      acceptedETAs: [],
      hasMedicalProfile: true,
      canSMS: true,
      timestamp: "2 min ago",
      status: "unaccepted",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    {
      id: "2",
      location: "0.7 miles away • 5th St & Mission",
      distance: "0.7 miles",
      description: "Elderly woman choking",
      type: "choking",
      acceptedCount: 1,
      acceptedETAs: ["3 min"],
      hasMedicalProfile: false,
      canSMS: false,
      timestamp: "5 min ago",
      status: "accepted",
      coordinates: { lat: 37.7849, lng: -122.4094 },
    },
    {
      id: "3",
      location: "1.2 miles away • Union Square",
      distance: "1.2 miles",
      description: "Heart attack symptoms",
      type: "heart-attack",
      acceptedCount: 2,
      acceptedETAs: ["5 min", "8 min"],
      hasMedicalProfile: true,
      canSMS: true,
      timestamp: "1 min ago",
      status: "accepted",
      coordinates: { lat: 37.7879, lng: -122.4075 },
    },
  ]);

  const emergencyOptions = [
    { value: "unresponsive", label: "Unresponsive Person" },
    { value: "choking", label: "Choking" },
    { value: "heart-attack", label: "Heart Attack" },
    { value: "breathing", label: "Breathing Problems" },
    { value: "other", label: "Other Emergency" },
  ];

  // Simulate notification for help providers
  useEffect(() => {
    if (userType === "help-provider" && appState === "provider-dashboard") {
      const timer = setTimeout(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userType, appState]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    switch (type) {
      case "help-seeker":
        setAppState("initial");
        break;
      case "help-provider":
        setAppState("provider-dashboard");
        break;
      case "general-user":
        setAppState("general-map");
        break;
    }
  };

  const handleGetHelp = () => {
    setAppState("confirmation");
  };

  const handleConfirmHelp = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAppState("waiting");

      setTimeout(() => {
        setAcceptedHelpers([
          {
            id: "1",
            name: "Dr. Sarah Johnson",
            distance: "0.3 miles",
            eta: "2 min",
            rating: 4.9,
          },
        ]);
        setAppState("help-on-way");
      }, 3000);
    }, 1500);
  };

  const handleCancelRequest = () => {
    setAppState("initial");
    setAcceptedHelpers([]);
    setIsLoading(false);
  };

  const handleAcceptRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setAppState("provider-accepted");
  };

  const handleConfirmAcceptance = () => {
    if (selectedRequestId) {
      setEmergencyRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequestId
            ? {
                ...req,
                acceptedCount: req.acceptedCount + 1,
                acceptedETAs: [...req.acceptedETAs, `${providerETA[0]} min`],
                status: "accepted",
              }
            : req
        )
      );
    }
    setAppState("provider-dashboard");
    setSelectedRequestId(null);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const renderUserSelection = () => (
    <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-medium text-foreground">
          Emergency Response System
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Choose your role to access the appropriate interface
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={() => handleUserTypeSelect("help-seeker")}
          className="w-full h-16 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">I Need Help</div>
              <div className="text-sm opacity-90">
                Request emergency CPR assistance
              </div>
            </div>
          </div>
        </Button>

        <Button
          onClick={() => handleUserTypeSelect("help-provider")}
          className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">I'm a CPR Provider</div>
              <div className="text-sm opacity-90">
                Respond to emergency requests
              </div>
            </div>
          </div>
        </Button>

        <Button
          onClick={() => handleUserTypeSelect("general-user")}
          variant="outline"
          className="w-full h-16 border-2 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">View Emergency Map</div>
              <div className="text-sm text-muted-foreground">
                See active emergencies in your area
              </div>
            </div>
          </div>
        </Button>
      </div>
    </main>
  );

  const renderProviderDashboard = () => (
    <main className="flex-1 flex flex-col p-4 space-y-4">
      {/* Notification Banner */}
      {showNotification && (
        <Card className="p-4 bg-destructive/10 border-destructive border-l-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-destructive" />
            <div>
              <h4 className="font-medium text-destructive">
                New Emergency Request!
              </h4>
              <p className="text-sm text-destructive/80">
                Help needed at 0.2 miles away. Tap to view details.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Provider Status */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div>
            <h3 className="font-medium text-green-800">
              Available for Emergencies
            </h3>
            <p className="text-sm text-green-600">
              Dr. Michael Chen • CPR Certified • 4.8 ⭐
            </p>
          </div>
        </div>
      </Card>

      {/* Small Map View */}
      <Card className="h-48 p-4 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-muted-foreground/30">
        <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
          <div className="relative">
            <Map className="w-12 h-12 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {
                  emergencyRequests.filter((r) => r.status === "unaccepted")
                    .length
                }
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-medium">Emergency Overview</p>
            <p className="text-sm">Your location: San Francisco, CA</p>
          </div>
        </div>
      </Card>

      {/* Emergency Requests List */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Active Emergency Requests
        </h3>

        {emergencyRequests.map((request) => (
          <Card
            key={request.id}
            className={`p-4 ${
              request.status === "unaccepted"
                ? "border-destructive/30 bg-destructive/5"
                : "border-green-200 bg-green-50/30"
            }`}
          >
            <div className="space-y-3">
              {/* Request Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{request.location}</span>
                    {request.status === "unaccepted" && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {request.description}
                  </p>

                  {/* Request Details */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{request.timestamp}</span>
                    {request.hasMedicalProfile && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Medical Profile</span>
                      </div>
                    )}
                    {request.canSMS && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>SMS OK</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Map className="w-4 h-4 mr-1" />
                  View on Map
                </Button>
              </div>

              {/* Acceptance Status */}
              {request.acceptedCount > 0 ? (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    {request.acceptedCount} provider
                    {request.acceptedCount > 1 ? "s" : ""} accepted
                  </p>
                  <p className="text-xs text-green-600">
                    ETAs: {request.acceptedETAs.join(", ")}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-orange-100 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    No providers have accepted yet
                  </p>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => handleAcceptRequest(request.id)}
                className={`w-full h-12 ${
                  request.status === "unaccepted"
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {request.status === "unaccepted" ? (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    ACCEPT REQUEST
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    JOIN RESPONSE
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );

  const renderProviderAccepted = () => {
    const selectedRequest = emergencyRequests.find(
      (r) => r.id === selectedRequestId
    );
    if (!selectedRequest) return null;

    return (
      <main className="flex-1 flex flex-col p-4 space-y-6">
        {/* Confirmation Header */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Request Accepted!</h3>
              <p className="text-sm text-green-600">
                Preparing to assist emergency responder
              </p>
            </div>
          </div>
        </Card>

        {/* Map View */}
        <Card className="flex-1 p-4 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-muted-foreground/30 min-h-[200px]">
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
            <div className="relative">
              <Route className="w-16 h-16 text-blue-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                <Navigation className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium">Route to Emergency</p>
              <p className="text-sm">{selectedRequest.location}</p>
              <p className="text-xs mt-2">
                Navigation will guide you to the exact location
              </p>
            </div>
          </div>
        </Card>

        {/* Emergency Details */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium">Emergency Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">
                {selectedRequest.type.replace("-", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="font-medium">{selectedRequest.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-medium">{selectedRequest.distance}</span>
            </div>
          </div>
        </Card>

        {/* ETA Input */}
        <Card className="p-4 space-y-4">
          <h3 className="font-medium">Set Your Estimated Arrival Time</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>ETA: {providerETA[0]} minutes</Label>
              <Badge variant="outline">{providerETA[0]} min</Badge>
            </div>
            <Slider
              value={providerETA}
              onValueChange={setProviderETA}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 min</span>
              <span>15 min</span>
              <span>30 min</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirmAcceptance}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
          >
            <Car className="w-4 h-4 mr-2" />
            Confirm - I'm On My Way
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-12 border-2">
              <Phone className="w-4 h-4 mr-2" />
              Call Patient
            </Button>
            <Button variant="outline" className="flex-1 h-12 border-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send SMS
            </Button>
          </div>

          <Button
            onClick={() => setAppState("provider-dashboard")}
            variant="outline"
            className="w-full h-12 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Acceptance
          </Button>
        </div>
      </main>
    );
  };

  const renderGeneralMap = () => (
    <main className="flex-1 flex flex-col p-4 space-y-4">
      {/* Map Header */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium">Emergency Activity Map</h3>
          </div>
          <Badge variant="outline">{emergencyRequests.length} Active</Badge>
        </div>
      </Card>

      {/* Map View */}
      <Card className="flex-1 p-4 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-muted-foreground/30 min-h-[400px]">
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
          <div className="relative">
            <Map className="w-20 h-20 text-blue-600" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {
                  emergencyRequests.filter((r) => r.status === "unaccepted")
                    .length
                }
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-medium">Live Emergency Map</p>
            <p className="text-sm">San Francisco Bay Area</p>
            <p className="text-xs mt-2">
              Red markers: Unaccepted • Green markers: Help en route
            </p>
          </div>
        </div>
      </Card>

      {/* Emergency Legend */}
      <Card className="p-4 space-y-3">
        <h4 className="font-medium">Active Emergencies</h4>
        <div className="space-y-2">
          {emergencyRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    request.status === "unaccepted"
                      ? "bg-destructive"
                      : "bg-green-500"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-sm">{request.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {request.status === "unaccepted" ? (
                  <Badge variant="destructive" className="text-xs">
                    No Response
                  </Badge>
                ) : (
                  <Badge className="text-xs bg-green-100 text-green-700">
                    {request.acceptedCount} Responding
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {request.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Share Button */}
      <Button variant="outline" className="w-full h-12 border-2">
        <Share2 className="w-4 h-4 mr-2" />
        Share Emergency Information
      </Button>
    </main>
  );

  const renderHelpSeekerScreens = () => {
    if (appState === "initial") {
      return (
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          <Card className="w-full max-w-md p-4 bg-muted/30">
            <div className="flex items-center gap-2 justify-center text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                Current Location: San Francisco, CA
              </span>
            </div>
          </Card>

          <div className="text-center space-y-2 max-w-md">
            <h2 className="text-xl font-medium text-foreground">
              Emergency CPR Assistance
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tap the button below to request immediate assistance from nearby
              CPR providers and emergency responders.
            </p>
          </div>

          <div className="w-full max-w-md space-y-4">
            <Button
              onClick={handleGetHelp}
              className="w-full h-20 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xl font-medium rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8" />
                GET HELP NOW
              </div>
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-12 border-2 hover:bg-muted"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 border-2 hover:bg-muted"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Emergency Tips
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-md p-4 bg-muted/30 border-l-4 border-l-destructive">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Before You Tap:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure the person is unresponsive</li>
                <li>• Check for breathing</li>
                <li>• Call 911 if not already done</li>
                <li>• Your location will be shared with responders</li>
              </ul>
            </div>
          </Card>
        </main>
      );
    }

    if (appState === "waiting" || appState === "help-on-way") {
      return (
        <main className="flex-1 flex flex-col p-4 space-y-4">
          <Card className="p-4 bg-muted/30 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Clock className="w-6 h-6 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-medium">Request Sent Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  {appState === "waiting"
                    ? "Waiting for a CPR provider to accept..."
                    : "Help is on the way!"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex-1 p-4 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-muted-foreground/30 min-h-[300px]">
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
              <div className="relative">
                <MapPin className="w-16 h-16 text-destructive" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Navigation className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium">Your Location</p>
                <p className="text-sm">123 Main Street, San Francisco</p>
                <p className="text-xs mt-2">
                  Map shows your exact position to responders
                </p>
              </div>
            </div>
          </Card>

          {acceptedHelpers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                CPR Provider Responding
              </h3>
              {acceptedHelpers.map((helper) => (
                <Card
                  key={helper.id}
                  className="p-4 border-green-200 bg-green-50/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {helper.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{helper.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {helper.distance} away • ETA {helper.eta}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                          <span className="text-xs text-muted-foreground">
                            {helper.rating} rating • CPR Certified
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      En Route
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button
            onClick={handleCancelRequest}
            variant="outline"
            className="w-full h-12 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Request
          </Button>
        </main>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <h1 className="text-lg font-medium">Emergency Response</h1>
          {userType && (
            <Badge variant="outline" className="ml-2">
              {userType === "help-seeker" && "Help Seeker"}
              {userType === "help-provider" && "Provider"}
              {userType === "general-user" && "Observer"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {userType && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserType(null);
                setAppState("user-selection");
              }}
              className="text-muted-foreground"
            >
              Switch Role
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleProfileClick}
            className="w-10 h-10"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-muted">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      {appState === "user-selection" && renderUserSelection()}
      {userType === "help-seeker" && renderHelpSeekerScreens()}
      {appState === "provider-dashboard" && renderProviderDashboard()}
      {appState === "provider-accepted" && renderProviderAccepted()}
      {appState === "general-map" && renderGeneralMap()}

      {/* Confirmation Dialog */}
      <Dialog
        open={appState === "confirmation"}
        onOpenChange={() => setAppState("initial")}
      >
        <DialogContent className="w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Confirm Emergency Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you need immediate CPR assistance? This will alert
              nearby trained providers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Type of Emergency</Label>
              <Select
                value={emergencyType}
                onValueChange={(value) =>
                  setEmergencyType(value as EmergencyType)
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emergencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {emergencyType === "other" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Description (Optional)
                </Label>
                <Textarea
                  placeholder="Brief description of the emergency..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Share Medical Profile
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow responders to see your medical information
                </p>
              </div>
              <Switch
                checked={shareMedicalProfile}
                onCheckedChange={setShareMedicalProfile}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleConfirmHelp}
                disabled={isLoading}
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Yes, Get Help Now
                  </>
                )}
              </Button>
              <Button
                onClick={() => setAppState("initial")}
                variant="outline"
                disabled={isLoading}
                className="w-full h-12"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="p-4 bg-card border-t border-border">
        <div className="text-center text-xs text-muted-foreground">
          <p>For immediate life-threatening emergencies, call 911</p>
          <p className="mt-1">
            This app connects you with trained CPR volunteers
          </p>
        </div>
      </footer>
    </div>
  );
}
